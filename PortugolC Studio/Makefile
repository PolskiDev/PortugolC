# -- macOS / MacOS X --
OSX_PIP=pip3
#OSX_PIP=python3 -m pip
#OSX_PIP=python -m pip

OSX_PYTHON=python3
#PYTHON=python
#PYTHON=python2


# -- WINDOWS --
WIN32_PIP=python -m pip
#WIN32_PIP=python3 -m pip

WIN32_PYTHON=python
#WIN32_PYTHON=python3


# -- GNU/LINUX --
LINUX_PIP=python3 -m pip
#WIN32_PIP=python -m pip

LINUX_PYTHON=python3
#WIN32_PYTHON=python



darwin:
	$(OSX_PIP) install ./py2app-master
	$(OSX_PYTHON) setup.py py2app -A
	
windows:
	$(WIN32_PIP) install ./pyinstaller-master
	$(WIN32_PYTHON) -m pip pyinstaller --onefile main.py
	
linux:
	$(LINUX_PIP) install ./pyinstaller-master
	$(LINUX_PYTHON) -m pip pyinstaller --onefile main.py


