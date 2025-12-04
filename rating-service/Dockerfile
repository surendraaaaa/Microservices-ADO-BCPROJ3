# Use official Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Copy requirements.txt first for caching dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5002

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

# Run the Flask app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5002", "--workers", "3"]
# CMD ["flask", "run", "--port=5002"]
