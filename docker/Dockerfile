FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y \
    libgl1-mesa-glx libglib2.0-0 \
    python3.10 git python3.10-venv python3.10-dev python3-pip \
    && ln -sf /usr/bin/python3.10 /usr/bin/python3 \
    && ln -sf /usr/bin/python3.10 /usr/bin/python

RUN git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git /app

WORKDIR /app

RUN apt-get install -y python3-pip && \
    python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir numpy==1.26.2

RUN python3 -m pip install --no-cache-dir -r requirements_versions.txt

RUN pip install xformers

CMD ["python3", "launch.py", "--api", "--nowebui", "--listen"]
