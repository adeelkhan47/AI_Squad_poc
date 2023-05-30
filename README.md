# AI Squad POC Translator

### Speech To Text Endpoint

#### Endpoint:

**/detector/speechtotext**

#### Requirements:
Create virtual environment and install libraries.
```bash

python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```
It also requires the command-line tool [`ffmpeg`](https://ffmpeg.org/) to be installed on your system, which is available from most package managers:

```bash
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```

You may need [`rust`](http://rust-lang.org) installed as well.
```bash
pip install setuptools-rust
```
#### Swagger UI Field:

* To get response from speech to text endpoint field **voice_path** is must and it can be relative to app.py file. For example, to use /audios/Recording.mp3 voice_path should be "**../audios/Recording.mp3**"
