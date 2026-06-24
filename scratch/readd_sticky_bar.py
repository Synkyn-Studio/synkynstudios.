import glob
import re
import os

project_dir = r"c:\Users\prajw\Documents\Dhiraj skykyn - Copy"
html_files = glob.glob(os.path.join(project_dir, "*.html"))

# The sticky-bar div + its inline style block to re-add
sticky_bar_block = """    <style>
        @media (max-width: 767.98px) {
            #sticky-bar {
                height: 4.5rem !important;
            }
        }
    </style>
    <div id="sticky-bar" data-gradual-blur data-target="page" data-position="bottom" data-height="7rem"
        data-strength="2" data-div-count="5" data-curve="bezier" data-exponential="true" data-opacity="1"
        data-z-index="50" data-duration="0.3s" data-easing="ease-out" data-show-on-scroll="50"></div>"""

for file_path in html_files:
    filename = os.path.basename(file_path)
    print(f"Processing {filename}...")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Only add if not already present
    if 'id="sticky-bar"' in content:
        print(f"  sticky-bar already present in {filename}. Skipping.")
        continue

    # Insert right after </footer> (the new disp footer)
    if '</footer>' in content:
        content = content.replace('</footer>', '</footer>\n' + sticky_bar_block, 1)
        print(f"  Re-added sticky-bar to {filename}.")
    else:
        print(f"  WARNING: No </footer> found in {filename}!")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("\nAll HTML files processed.")
