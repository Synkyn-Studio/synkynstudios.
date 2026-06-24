import glob
import re
import os

# Root directory of the project
project_dir = r"c:\Users\prajw\Documents\Dhiraj skykyn - Copy"

# The new footer markup without the big base logo mark
new_footer_html = """    <footer class="disp" aria-labelledby="disp-logo">
        <div class="disp__wrap">

            <div class="disp__head">
                <a class="disp__logo" href="./index.html" aria-label="Synkyn Studios — home" id="disp-logo">
                    <span class="mark" role="img" aria-label="Synkyn Studios"></span>
                    <span class="fallback" aria-hidden="true">Synkyn Studios</span>
                </a>
                <span class="disp__locale"><b aria-hidden="true">◆</b> Bengaluru, India</span>
            </div>

            <div class="disp__rule" aria-hidden="true"></div>

            <div class="disp__cols">
                <!-- About -->
                <section class="disp__col disp__about" aria-label="About the studio">
                    <p class="disp__label">About the studio</p>
                    <p>Synkyn Studios is a cinematic, AI-first creative studio — directing generative image and video with a filmmaker's eye. We build brands and films that feel as good as they look, from Bengaluru to everywhere.</p>
                    <p class="disp__sign">— Designed for space. Destined for Earth.</p>
                </section>

                <!-- Directory -->
                <nav class="disp__col" aria-label="Directory">
                    <p class="disp__label">Directory</p>
                    <ul class="disp__idx">
                        <li><a href="./index.html">Home</a><span class="dots"></span><span class="pg">01</span></li>
                        <li><a href="./about-us.html">About</a><span class="dots"></span><span class="pg">02</span></li>
                        <li><a href="./why-retrofit.html">Retrofit</a><span class="dots"></span><span class="pg">03</span></li>
                        <li><a href="./contact.html">Contact</a><span class="dots"></span><span class="pg">04</span></li>
                    </ul>
                </nav>

                <!-- Correspondence -->
                <section class="disp__col" aria-label="Correspondence">
                    <p class="disp__label">Correspondence</p>
                    <div class="disp__block">
                        <p class="k">Electronic post</p>
                        <a href="mailto:info@synkynstudios.com">info@synkynstudios.com</a>
                    </div>
                    <div class="disp__block">
                        <p class="k">Bureau</p>
                        <address>Bengaluru, Karnataka<br>India — 560001</address>
                    </div>
                    <div class="disp__block">
                        <p class="k">Legal</p>
                        <a href="./privacy.html">Privacy</a> &nbsp;·&nbsp; <a href="./terms.html">Terms</a>
                    </div>
                </section>

                <!-- Local time + Follow -->
                <section class="disp__col" aria-label="Local time and social">
                    <p class="disp__label">Local time</p>
                    <div class="disp__clock"><span id="disp-time">--:--:--</span><span class="ampm" id="disp-ampm">--</span></div>
                    <p class="disp__tz">IST — Bengaluru, India</p>

                    <div class="disp__follow">
                        <p class="disp__label">Follow</p>
                        <ul>
                            <li><a href="https://www.instagram.com/" target="_blank"><span class="lbl"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></span>Instagram</span> <span class="arw" aria-hidden="true">↗</span></a></li>
                            <li><a href="https://www.linkedin.com/company/synkynstudios/" target="_blank"><span class="lbl"><span class="ico" aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg></span>LinkedIn</span> <span class="arw" aria-hidden="true">↗</span></a></li>
                            <li><a href="https://x.com/" target="_blank"><span class="lbl"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>X</span> <span class="arw" aria-hidden="true">↗</span></a></li>
                            <li><a href="https://www.youtube.com/" target="_blank"><span class="lbl"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.89.52 9.39.52 9.39.52s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z"/></svg></span>YouTube</span> <span class="arw" aria-hidden="true">↗</span></a></li>
                        </ul>
                    </div>
                </section>
            </div>

            <div class="disp__foot">
                <p class="disp__copy">© 2026 <b>Synkyn Studios</b> · Made in Bengaluru, India</p>
                <button class="disp__top" type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    Go up <span aria-hidden="true">↑</span>
                </button>
            </div>
        </div>
    </footer>"""

html_files = glob.glob(os.path.join(project_dir, "*.html"))

for file_path in html_files:
    filename = os.path.basename(file_path)
    print(f"Processing {filename}...")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Match the new footer container class="disp"
    footer_pattern = re.compile(r'(<footer\s+class="disp"[^>]*>.*?</footer>)', re.DOTALL)
    match = footer_pattern.search(content)
    
    if not match:
        print(f"  WARNING: Could not find footer class='disp' in {filename}!")
        continue
        
    old_footer = match.group(1)
    
    # Extract scripts inside the old footer so we don't lose vendor / main scripts
    scripts = re.findall(r'(<script[^>]*>.*?</script>)', old_footer, re.DOTALL)
    print(f"  Extracted {len(scripts)} script tags from the old footer.")
    
    # Keep standard indent/whitespace structure
    scripts_str = "\n    ".join(scripts)
    
    # Replacement block
    replacement = new_footer_html + "\n    " + scripts_str
    content = content.replace(old_footer, replacement)
    
    # Save the modified content back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Successfully updated {filename}.\n")

print("All HTML files processed.")
