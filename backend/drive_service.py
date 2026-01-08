from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
import json
import io

SCOPES = ['https://www.googleapis.com/auth/drive.appdata']

def get_drive_service(token: str):
    """
    Authenticate using the user's forwarded access token.
    """
    creds = Credentials(token=token, scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)
    return service

def create_folder(service, folder_name: str, parent_id: str = 'appDataFolder'):
    """
    Creates a folder in the specified parent (default: appDataFolder).
    """
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent_id]
    }
    file = service.files().create(body=file_metadata, fields='id').execute()
    return file.get('id')

def list_files_in_folder(service, folder_id: str = 'appDataFolder', q_filter: str = None):
    """
    List files in a specific folder.
    """
    if folder_id == 'appDataFolder':
        # exact query for appDataFolder alias
        query = "'appDataFolder' in parents and trashed = false"
    else:
        query = f"'{folder_id}' in parents and trashed = false"
        
    if q_filter:
        query += f" and {q_filter}"
    
    # spaces='appDataFolder' is required to see the appDataFolder contents
    results = service.files().list(q=query, spaces='appDataFolder',
                                   fields="nextPageToken, files(id, name)").execute()
    return results.get('files', [])

def upload_json(service, data: dict, filename: str, folder_id: str = 'appDataFolder'):
    """
    Uploads a JSON object as a file.
    """
    file_metadata = {
        'name': filename,
        'parents': [folder_id]
    }
    media = MediaIoBaseUpload(io.BytesIO(json.dumps(data).encode('utf-8')),
                              mimetype='application/json',
                              resumable=True)
    file = service.files().create(body=file_metadata,
                                  media_body=media,
                                  fields='id').execute()
    return file.get('id')

def upload_file_stream(service, fileobj, filename: str, folder_id: str = 'appDataFolder', mimetype: str = 'application/octet-stream'):
    """
    Uploads any file stream.
    """
    file_metadata = {
        'name': filename,
        'parents': [folder_id]
    }
    media = MediaIoBaseUpload(fileobj, mimetype=mimetype, resumable=True)
    file = service.files().create(body=file_metadata,
                                  media_body=media,
                                  fields='id').execute()
    return file.get('id')

def get_file_content(service, file_id: str):
    """
    Downloads file content.
    """
    request = service.files().get_media(fileId=file_id)
    file = io.BytesIO()
    downloader = MediaIoBaseDownload(file, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    return file.getvalue().decode('utf-8')
