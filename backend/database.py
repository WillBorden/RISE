from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# database connection
# second line is default value - change actual url in your .env file
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:tmr%40pai3t6r@localhost:5432/RISE"
)

# create SQLAlchemy database engine and database metadata
engine = create_engine(DATABASE_URL, echo=True)
metadata = MetaData()

# reflect database metadata
metadata.reflect(engine)

# create python models automatically from database metadata
Base = automap_base(metadata = metadata)
Base.prepare()

try:
    projects = Base.classes.projects
    requirements = Base.classes.requirements
    components = Base.classes.components
    allocations = Base.classes.allocations
    component_reports = Base.classes.component_reports
    electrical_components = Base.classes.electrical_components
    interfaces = Base.classes.interfaces
    milestones = Base.classes.milestones
    reports = Base.classes.reports
    requirement_reports = Base.classes.reports
except AttributeError as e:
    print(f"Warning! This is awkward ... the following tables were not found in your database: {e}")
    print("Make sure your database has all the required tables!")

# session maker
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# database dependancy for FastAPI
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()