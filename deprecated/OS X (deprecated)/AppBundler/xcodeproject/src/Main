#!/usr/local/bin/python3

from tkinter import *
#import ctypes
import re
import os
#from fontTools.ttLib import TTFont
import tkinter.font as tkfont
from tkinter.filedialog import asksaveasfile
from tkinter.filedialog import askopenfilename
from tkinter import simpledialog
from tkinter import filedialog
from tkinter import messagebox
import subprocess
import platform
# Increas Dots Per inch so it looks sharper
#ctypes.windll.shcore.SetProcessDpiAwareness(True)

# Setup Tkinter
root = Tk()
root.geometry('1800x900+50+50')
root.iconbitmap("portugol.png")
root.title("PortugolC Studio")


openx = None

# Register Changes made to the Editor Content
def changes(event=None):
    global previousText

    # If actually no changes have been made stop / return the function
    if editArea.get('1.0', END) == previousText:
        return

    # Remove all tags so they can be redrawn
    for tag in editArea.tag_names():
        editArea.tag_remove(tag, "1.0", "end")

    # Add tags where the search_re function found the pattern
    i = 0
    for pattern, color in repl:
        for start, end in search_re(pattern, editArea.get('1.0', END)):
            editArea.tag_add(f'{i}', start, end)
            editArea.tag_config(f'{i}', foreground=color)

            i+=1

    previousText = editArea.get('1.0', END) 

def search_re(pattern, text, groupid=0):
    matches = []

    text = text.splitlines()
    for i, line in enumerate(text):
        for match in re.finditer(pattern, line):

            matches.append(
                (f"{i + 1}.{match.start()}", f"{i + 1}.{match.end()}")
            )

    return matches


def rgb(rgb):
    return "#%02x%02x%02x" % rgb


previousText = ''

# Define colors for the variouse types of tokens
normal = rgb((234, 234, 234))
keywords = rgb((234, 95, 95))
comments = rgb((128, 128, 128))
string = rgb((233, 195, 56))
function = rgb((95, 211, 234))
background = rgb((42, 42, 42))
modifiers = rgb((102, 178, 255))
digits = rgb((204,153,255))
boolean = rgb((16,155,131))


#TTF = TTFont("mono.ttf")
font_name = "Monaco"
font_size = 21
font = font_name+' '+str(font_size)


# Define a list of Regex Pattern that should be colored in a certain way
repl = [
    ['(funcao |se |senao |senaose |enquanto |para |ate|parar|continuar|incluir|importar|programa|fimprograma|pacote|vezes|retorne)', keywords],
    ['".*?"', string],
    ['\'.*?\'', string],
    ['//.*?$', comments],
    ['[0-9]', digits],

    ['(verdadeiro|falso|nulo)', boolean],
    ['(var|inteiro|inteiro8|inteiro16|inteiro32|inteiro64|flutuante|flutuante64|cadeia |logico|igual|diferente)', modifiers]
]

# Make the Text Widget
# Add a hefty border width so we can achieve a little bit of padding
editArea = Text(
    root,
    background=background,
    foreground=normal,
    insertbackground=normal,
    relief=FLAT,
    borderwidth=30,
    font=font
)
font = tkfont.Font(font=editArea['font'])
tab = font.measure('    ')
editArea.config(tabs=tab)

# Place the Edit Area with the pack method
editArea.pack(
    fill=BOTH,
    expand=1
)

# Insert some Standard Text into the Edit Area
#editArea.insert('1.0', code.llc)



# Ferramentas
def salvar():
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Salvar Projeto?")
    if answer:
        # Ask for filename
        Arq = asksaveasfile(defaultextension=".por", filetypes=[("PortugolC Studio","*.por")]).name
        x = editArea.get('1.0', END)
        print(Arq)

        # Write the Content to the Temporary File
        file = open(Arq,'w')
        file.write(str(x))
        file.close()

def compilar():
    salvar()
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Construir Projeto?")
    if answer:
        # Ask for filename
        # Arq = asksaveasfile(defaultextension=".por", filetypes=[("PortugolC Studio","*.por")]).name
        messagebox.showinfo("Atenção","Selecione o projeto que deseja construir")
        selected_folder = filedialog.askdirectory()
        Arq = 'inicio.por.swap'    #simpledialog.askstring("Main binary", "Main source name", parent=root)
        x = editArea.get('1.0', END)
        print(Arq)

        # Write the Content to the Temporary File
        file = open(Arq,'w')
        file.write(str(x))
        file.close()

        # if platform.system() == 'Windows':


        # COMPILE AND EXECUTE BINARY
        # cmd = "cd "+selected_folder+" && portugolc "+Arq+" -o "+Arq.replace(".por","")+" && ./"+Arq.replace(".por","")
        # os.system(cmd)

        # ONLY COMPILE TO BINARY
        cmd = "cd "+selected_folder+" && portugolc "+Arq+" -o "+Arq.replace(".por","")
        os.system(cmd)
        messagebox.showinfo("Construído","Binário construído com sucesso!")


def compilar_jogo():
    salvar()
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Construir Jogo?")
    if answer:
        # Ask for filename
        # Arq = asksaveasfile(defaultextension=".por", filetypes=[("PortugolC Studio","*.por")]).name
        messagebox.showinfo("Atenção","Selecione o projeto que deseja construir")
        selected_folder = filedialog.askdirectory()
        Arq = 'jogo.por.swap'    #simpledialog.askstring("Main binary", "Main source name", parent=root)
        x = editArea.get('1.0', END)
        print(Arq)

        # Write the Content to the Temporary File
        file = open(Arq,'w')
        file.write(str(x))
        file.close()

        # if platform.system() == 'Windows':


        # COMPILE AND EXECUTE BINARY
        # cmd = "cd "+selected_folder+" && portugolc "+Arq+" -o "+Arq.replace(".por","")+" && ./"+Arq.replace(".por","")
        # os.system(cmd)

        # ONLY COMPILE TO BINARY
        if platform == 'Windows':
            cmd = "cd "+selected_folder+" && start studio build"
        else:
            cmd = "cd "+selected_folder+" && ./studio build"

        os.system(cmd)
        messagebox.showinfo("Construído","Jogo construído com sucesso!")


def abrir_projeto():
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Abrir Projeto?")
    if answer:
        #selected_folder = filedialog.askdirectory()
        answer = messagebox.showinfo(title="PortugolC Studio",message="Selecione o arquivo que deseja editar")
        openx = filedialog.askopenfilename()
        x = open(openx,'r')
        x1 = x.read()
        x.close()
        editArea.delete('1.0', END)
        editArea.insert('1.0', x1)



def novo_projeto():
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Criar Novo Projeto?")
    if answer:
        selected_folder = filedialog.askdirectory()
        created_project = simpledialog.askstring("Novo Projeto", "Nome do Projeto",
                                    parent=root)
        os.system("cd "+selected_folder+" && portugolc --novo "+created_project)
        abrir_projeto()

def novo_jogo():
    answer = messagebox.askokcancel(title="PortugolC Studio",message="Criar Novo Jogo?")
    if answer:
        selected_folder = filedialog.askdirectory()
        created_project = simpledialog.askstring("Novo Jogo", "Nome do Jogo",
                                    parent=root)
        os.system("cd "+selected_folder+" && portugolc --novo-jogo "+created_project)
        abrir_projeto()


# Botoes
painel = Frame(root)
painel.pack(side=TOP, fill = BOTH)


Titulo = Label(painel, text="Painel de Opçôes")
Titulo.config(font=("Arial", 15))
Titulo.pack(expand=True, fill=BOTH)

dir_path = os.path.dirname(os.path.realpath(__file__))

executar = PhotoImage(file=os.path.join(dir_path, 'executar.png'))
abrir = PhotoImage(file=os.path.join(dir_path, 'abrir.png'))
novo = PhotoImage(file=os.path.join(dir_path, 'novo.png'))
armazenar = PhotoImage(file=os.path.join(dir_path, 'salvar.png'))
novo_jogo_img = PhotoImage(file=os.path.join(dir_path, 'novo_jogo.png'))
executar_jogo = PhotoImage(file=os.path.join(dir_path, 'jogo.png'))

NewProject = Button(painel, image=novo, command=novo_projeto, borderwidth=0)
NewProject.pack(side=LEFT, expand=True, fill=BOTH)

NewGame = Button(painel, image=novo_jogo_img, command=novo_jogo, borderwidth=0)
NewGame.pack(side=LEFT, expand=True, fill=BOTH)


OpenProject = Button(painel, image=abrir,command=abrir_projeto, borderwidth=0)
OpenProject.pack(side=LEFT, expand=True, fill=BOTH)

SaveBtn = Button(painel, image=armazenar, command=salvar)
SaveBtn.pack(side=LEFT, expand=True, fill=BOTH)


SaveAndBuild = Button(painel, image=executar,command=compilar, borderwidth=0)
SaveAndBuild.pack(side=LEFT, expand=True, fill=BOTH)

SaveGame = Button(painel, image=executar_jogo,command=compilar_jogo, borderwidth=0)
SaveGame.pack(side=LEFT, expand=True, fill=BOTH)



# Bind the KeyRelase to the Changes Function
editArea.bind('<KeyRelease>', changes)


changes()
root.mainloop()
