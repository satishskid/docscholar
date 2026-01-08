import requests
import time
import os
from reportlab.pdfgen import canvas

BASE_URL = "http://localhost:8000/api/v1"

def generate_pdf(filename="sample.pdf"):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "This is a test PDF for DocScholar E2E testing.")
    c.drawString(100, 730, "It contains some text about machine learning and vector databases.")
    c.drawString(100, 710, "Neon PostgreSQL with pgvector is used for storage.")
    c.save()
    return filename

def test_flow():
    print("Starting E2E Test Flow on port 8000...")
    
    # 1. Generate PDF
    pdf_path = generate_pdf("e2e_test_doc.pdf")
    print(f"Generated PDF at {pdf_path}")

    try:
        # 2. Test Project Creation
        print("\n[1] Creating Project...")
        project_data = {
            "title": "E2E Migration Test",
            "pico": {"population": "Test Users", "intervention": "Migration", "comparison": "Legacy", "outcome": "Success"}
        }
        headers = {
            "X-Google-Drive-Token": "test-token",
            "X-Gemini-Key": "test-key"
        }
        res = requests.post(f"{BASE_URL}/projects/create", json=project_data, headers=headers)
        if res.status_code != 200:
            print(f"Failed to create project: {res.text}")
            return
        project = res.json()
        project_id = project['id']
        print(f"Project Created: {project_id}")

        # 3. Test PDF Upload
        print("\n[2] Uploading PDF...")
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            # Note: params are query params for FastAPI if not in body. 
            # Check main.py: project_id is query or body? 
            # upload_pdf(project_id: str, ...) -> usually query if not Body(embed=True)
            # In main.py: project_id: str -> Query parameter by default in FastAPI
            res = requests.post(f"{BASE_URL}/files/upload_pdf", params={"project_id": project_id}, files=files, headers=headers)
            
        if res.status_code != 200:
            print(f"Failed to upload PDF: {res.text}")
            return
        upload_data = res.json()
        print(f"PDF Uploaded. Status: {upload_data['status']}, Chunks: {upload_data['chunks_processed']}")
        
        # Wait a bit for consistency if needed (DB is immediate usually)
        time.sleep(1)

        # 4. Test Chat (RAG)
        print("\n[3] Testing Chat RAG...")
        chat_payload = {
            "query": "What database technology is used?",
            "project_id": project_id
        }
        res = requests.post(f"{BASE_URL}/ai/chat_with_docs", json=chat_payload, headers=headers)
        if res.status_code != 200:
            print(f"Chat failed: {res.text}")
            return
        chat_res = res.json()
        print(f"Chat Answer: {chat_res.get('answer')}")
        print(f"Citations: {len(chat_res.get('citations', []))}")

        # 5. Test Autocomplete
        print("\n[4] Testing Autocomplete...")
        autocomplete_payload = {
            "text": "The project uses Neon PostgreSQL with ",
            "cursor_position": 36,
            "project_id": project_id
        }
        res = requests.post(f"{BASE_URL}/ai/autocomplete", json=autocomplete_payload, headers=headers)
        if res.status_code != 200:
            print(f"Autocomplete failed: {res.text}")
            return
        auto_res = res.json()
        print(f"Autocomplete Suggestion: {auto_res.get('suggestion')}")
        
        print("\nSUCCESS: All steps executed.")
        
    except Exception as e:
        print(f"Test Exception: {e}")
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

if __name__ == "__main__":
    test_flow()
