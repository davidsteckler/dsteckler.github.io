name = input("Your first name: ")
project = input("What will you build? ")
width = max(len(name), len(project), 18) + 4
print("+" + "-" * width + "+")
print("|" + name.center(width) + "|")
print("|" + project.center(width) + "|")
print("+" + "-" * width + "+")
