from setuptools import setup

APP_NAME = 'PortugolC Studio'
APP = ['main.py']
DATA_FILES = ['abrir.png','executar.png','jogo.png','novo_jogo.png','novo.png','portugol.png','salvar.png','salvar1.png']
OPTIONS = {
    'argv_emulation': False,
    'iconfile': 'icns/app.icns'
}

setup(
    name=APP_NAME,
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
