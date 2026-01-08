from sqlalchemy import  Column, String, Float, JSON, DateTime, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
import datetime
import uuid
from database import engine

Base = declarative_base()

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    pico = Column(JSON, nullable=True)
    protocol = Column(JSON, nullable=True)
    matrix_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))

class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, nullable=False)
    drive_file_id = Column(String, nullable=False)
    title = Column(String, nullable=True)
    novelty_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    embedding = Column(Vector(768))

class EmbeddingChunk(Base):
    __tablename__ = 'embedding_chunks'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, nullable=False) # Foreign key to Document.id (conceptual)
    chunk_index = Column(JSON, nullable=True) # or integer
    text_content = Column(String, nullable=False)
    embedding = Column(Vector(768))

def init_db():
    # Enable pgvector extension if we were using it, but for now just standard tables
    # user asked for "Full RAG" later, so we will need it eventually.
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
    except Exception as e:
        print(f"Vector extension warning (might need superuser): {e}")

    # WARNING: Dropping all tables to ensure clean schema update
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
