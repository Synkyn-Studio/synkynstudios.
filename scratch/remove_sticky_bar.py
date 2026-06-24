import glob
import re
import os

# Root directory of the project
project_dir = r"c:\Users\prajw\Documents\Dhiraj skykyn - Copy"

html_files = glob.glob(os.path.join(project_dir, "*.html"))

for file_path in html_files:
    filename = os.path.basename(file_path)
    print(f"Processing {filename}...")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Remove style block for #sticky-bar
    style_pattern = re.compile(
        r'<style>\s*@media\s*\(max-width:\s*767\.98px\)\s*\{\s*#sticky-bar\s*\{\s*height:\s*4\.5rem\s*!important;\s*\}\s*\}\s*</style>',
        re.DOTALL
    )
    content = style_pattern.sub('', content)
    
    # 2. Remove sticky-bar div
    div_pattern = re.compile(
        r'<div\s+id="sticky-bar"[^>]*></div>',
        re.DOTALL
    )
    content = div_pattern.sub('', content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"  Successfully removed sticky-bar blur from {filename}.")

print("All HTML files processed.")
