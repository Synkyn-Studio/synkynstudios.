import glob
import re
import os

project_dir = r"c:\Users\prajw\Documents\Dhiraj skykyn - Copy"
html_files = glob.glob(os.path.join(project_dir, "*.html"))

count = 0
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    old = './assets/fx.js">'
    new = './assets/fx.js?v=3">'
    
    if old in content:
        content = content.replace(old, new)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        count += 1
        print(f"  Updated {os.path.basename(file_path)}")

print(f"\nUpdated {count} files with fx.js?v=3")
