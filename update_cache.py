import glob
import re

html_files = glob.glob('c:/Users/prajw/Documents/Dhiraj skykyn - Copy/*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'href="\./assets/navbar\.css(\?v=\d+)?"', 'href="./assets/navbar.css?v=6"', content)
    content = re.sub(r'src="\./assets/navbar\.js(\?v=\d+)?"', 'src="./assets/navbar.js?v=6"', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Updated cache busters in HTML files to v=6')
print('Updated cache busters in HTML files')
