const desktopNav = document.getElementById('desktop-navbar');
if (desktopNav) {
    desktopNav.innerHTML = `
                <ul class="flex items-center">
                    <li class="nav-item relative cursor-pointer py-2.5">
                        <a class="hover:text-accent hover:border-accent dark:hover:border-stroke-7 text-tagline-1 text-accent/60 dark:text-accent/60 dark:hover:text-accent group flex items-center gap-1 rounded-full border border-transparent px-4 py-2 font-normal transition-all duration-200"
                            href="./">
                            <span>Home</span>
                        </a>
                    </li>
                    <li class="nav-item relative cursor-pointer py-2.5" data-menu="works-mega-menu">
    <a class="hover:text-accent hover:border-accent dark:hover:border-stroke-7 text-tagline-1 text-accent/60 dark:text-accent/60 dark:hover:text-accent group flex items-center gap-1 rounded-full border border-transparent px-4 py-2 font-normal transition-all duration-200"
        href="javascript:void(0)">
        <span>Works</span>
        <span class="nav-arrow block origin-center translate-y-px transition-all duration-300">
            <svg class="stroke-accent/60 group-hover:stroke-accent size-4" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </span>
    </a>
    <div>
        <div class="dropdown-menu-bridge pointer-events-none fixed top-full left-1/2 z-40 h-3 w-full -translate-x-1/2 bg-transparent opacity-0 lg:w-[946px]"></div>
        <div class="dropdown-menu dark:bg-helix-blue-dark border-stroke-1 pointer-events-none fixed top-full left-1/2 z-50 mt-2 flex w-full -translate-x-1/2 items-stretch gap-y-6 rounded-[20px] border bg-white p-4 opacity-0 transition-all duration-300 md:gap-x-6 lg:w-[946px] dark:border-white/10"
            id="works-mega-menu">

            <!-- LEFT: Nav cards -->
            <div class="w-[320px] shrink-0 flex flex-col">
                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 px-2 pb-2.5 pt-1 font-semibold uppercase tracking-wide">Explore</p>
                <ul class="space-y-3 flex-1">
                    <li>
                        <a class="group relative flex items-center justify-between rounded-[14px] border border-transparent dark:border-white/5 bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-white/10 hover:bg-[#252525]" href="./album.html">
                            <div class="flex items-center gap-4">
                                <div class="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#2a2a2a] transition-colors duration-300 group-hover:bg-[#333]">
                                    <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <rect class="stroke-white" x="3" y="3" width="14" height="14" rx="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></rect>
                                        <path class="stroke-white" d="M3 14l4-4 4 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                                        <path class="stroke-white" d="M14 10l3 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                                        <circle class="stroke-white" cx="13" cy="7" r="1.5" stroke-width="1.5"></circle>
                                    </svg>
                                </div>
                                <div class="flex flex-col text-left">
                                    <p class="text-[15px] font-medium text-white leading-tight">Album</p>
                                    <p class="text-[12px] text-white/60 font-normal mt-0.5">Our Works — Skykyn</p>
                                </div>
                            </div>
                            <svg class="size-4 stroke-white transition-all duration-300 group-hover:translate-x-1" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a class="group relative flex items-center justify-between rounded-[14px] border border-transparent dark:border-white/5 bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-white/10 hover:bg-[#252525]" href="./prints.html">
                            <div class="flex items-center gap-4">
                                <div class="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#2a2a2a] transition-colors duration-300 group-hover:bg-[#333]">
                                    <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path class="stroke-white" d="M2.5 14.166l7.5 3.334 7.5-3.334M2.5 9.166l7.5 3.334 7.5-3.334M10 2.5L2.5 5.833l7.5 3.334 7.5-3.334L10 2.5z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="flex flex-col text-left">
                                    <p class="text-[15px] font-medium text-white leading-tight">Prints</p>
                                    <p class="text-[12px] text-white/60 font-normal mt-0.5">Discover our creative prints</p>
                                </div>
                            </div>
                            <svg class="size-4 stroke-white transition-all duration-300 group-hover:translate-x-1" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- RIGHT: What's new (single blurred featured card) -->
            <div class="flex-1 flex flex-col">
                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 px-2 pb-2.5 pt-1 font-semibold uppercase tracking-wide">What&rsquo;s new</p>
                <a href="./prints.html#project-1"
                    class="group relative block flex-1 w-full overflow-hidden rounded-[24px] border border-stroke-1 dark:border-white/10 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 min-h-[220px] bg-[#1a1a1a] isolate"
                    style="transform: translateZ(0); mask-image: radial-gradient(white, black); -webkit-mask-image: -webkit-radial-gradient(white, black);">
                    <!-- Blurred image fill -->
                    <div class="absolute inset-0 h-full w-full overflow-hidden rounded-[24px] z-0">
                        <img alt="Grooming - Zlade"
                            class="h-full w-full object-cover blur-sm scale-[1.20] transition-transform duration-[900ms] ease-out group-hover:scale-[1.25]"
                            decoding="async" loading="lazy"
                            src="https://ik.imagekit.io/mkzeqs9lt/For-Website-Synkyn/Prints/Zlade/11.png?updatedAt=1783513857260"
                            onerror="this.style.display='none'" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 rounded-[24px]"></div>
                    </div>
                    <!-- Bottom bar -->
                    <div class="absolute inset-x-0 bottom-0 z-10 p-3">
                        <div class="flex items-center justify-between bg-black/60 backdrop-blur-md p-2 pl-3 rounded-full border border-white/10 shadow-lg group-hover:bg-black/80 transition-colors">
                            <div class="flex flex-col min-w-0 mr-2">
                                <p class="text-[13px] text-white font-medium drop-shadow-lg leading-tight truncate">NBK111 Glimpse</p>
                                <p class="text-[10px] text-white/70 font-normal drop-shadow-md leading-tight truncate mt-0.5">#NBK111 Glimpse - Entry of an Era</p>
                            </div>
                            <div class="group-hover:bg-helix-blue bg-white/20 relative flex h-7 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[40px] transition-all duration-500 ease-in-out">
                                <figure class="relative size-4 overflow-hidden">
                                    <img alt="new-arrow" class="absolute inset-0 size-full -translate-x-4 object-cover transition-transform duration-400 ease-in-out group-hover:translate-x-1" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E" />
                                    <img alt="new-arrow" class="size-full object-cover transition-transform duration-400 ease-in-out group-hover:translate-x-4" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E" />
                                </figure>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

        </div>
    </div>
</li>
<li class="nav-item relative cursor-pointer py-2.5" data-menu="company-mega-menu-v2">
    <a class="hover:text-accent hover:border-accent dark:hover:border-stroke-7 text-tagline-1 text-accent/60 dark:text-accent/60 dark:hover:text-accent group flex items-center gap-1 rounded-full border border-transparent px-4 py-2 font-normal transition-all duration-200"
        href="javascript:void(0)">
        <span>Company</span>
        <span class="nav-arrow block origin-center translate-y-px transition-all duration-300">
            <svg class="stroke-accent/60 group-hover:stroke-accent size-4" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </span>
    </a>
    <div>
        <div class="dropdown-menu-bridge pointer-events-none fixed top-full left-1/2 z-40 h-3 w-full -translate-x-1/2 bg-transparent opacity-0 lg:w-[946px]"></div>
        <div class="dropdown-menu dark:bg-helix-blue-dark border-stroke-1 pointer-events-none fixed top-full left-1/2 z-50 mt-2 flex w-full -translate-x-1/2 items-stretch gap-y-6 rounded-[20px] border bg-white p-4 opacity-0 transition-all duration-300 md:gap-x-6 lg:w-[946px] dark:border-white/10"
            id="company-mega-menu-v2">

            <!-- COLUMN 1: Company -->
            <div class="flex-1 flex flex-col">
                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 px-2 pb-2.5 pt-1 font-semibold uppercase tracking-wide">Company</p>
                <ul class="space-y-2">
                    <li>
                        <a class="group relative flex items-start gap-2 p-3" href="./about-us.html">
                            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background-3 dark:bg-background-7 opacity-0 group-hover:opacity-100 rounded-[10px] z-0 transition-all duration-400"></div>
                            <div class="border-stroke-1 relative z-10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border p-1 dark:border-white/10">
                                <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path class="stroke-secondary dark:stroke-accent" d="M3 18h14M5 18V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12M8 8h4M8 12h4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="relative z-10">
                                <p class="text-tagline-1 text-secondary dark:text-accent font-normal">About Us</p>
                                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">Learn more about our company</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="group relative flex items-start gap-2 p-3" href="./about-us.html#team">
                            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background-3 dark:bg-background-7 opacity-0 group-hover:opacity-100 rounded-[10px] z-0 transition-all duration-400"></div>
                            <div class="border-stroke-1 relative z-10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border p-1 dark:border-white/10">
                                <svg fill="none" height="20" viewbox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path class="stroke-secondary dark:stroke-accent" d="M19.167 17.5V15.8333C19.1664 15.0948 18.9206 14.3773 18.4681 13.7936C18.0156 13.2099 17.3821 12.793 16.667 12.6083" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path class="stroke-secondary dark:stroke-accent" d="M14.1663 17.5V15.8333C14.1663 14.9493 13.8152 14.1014 13.19 13.4763C12.5649 12.8512 11.7171 12.5 10.833 12.5H4.16634C3.28229 12.5 2.43444 12.8512 1.80932 13.4763C1.1842 14.1014 0.833008 14.9493 0.833008 15.8333V17.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path class="stroke-secondary dark:stroke-accent" d="M13.333 2.60834C14.05 2.79192 14.6855 3.20892 15.1394 3.7936C15.5932 4.37827 15.8395 5.09736 15.8395 5.8375C15.8395 6.57765 15.5932 7.29674 15.1394 7.88141C14.6855 8.46609 14.05 8.88309 13.333 9.06667" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path class="stroke-secondary dark:stroke-accent" d="M7.50033 9.16667C9.34127 9.16667 10.8337 7.67428 10.8337 5.83333C10.8337 3.99238 9.34127 2.5 7.50033 2.5C5.65938 2.5 4.16699 3.99238 4.16699 5.83333C4.16699 7.67428 5.65938 9.16667 7.50033 9.16667Z" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="relative z-10">
                                <p class="text-tagline-1 text-secondary dark:text-accent font-normal">Our Team</p>
                                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">Meet the people behind Synkyn Studios.</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- COLUMN 2: Resources -->
            <div class="flex-1 flex flex-col">
                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 px-2 pb-2.5 pt-1 font-semibold uppercase tracking-wide">Resources</p>
                <ul class="space-y-2">
                    <li>
                        <a class="group relative flex items-start gap-2 p-3" href="./contact.html">
                            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background-3 dark:bg-background-7 opacity-0 group-hover:opacity-100 rounded-[10px] z-0 transition-all duration-400"></div>
                            <div class="border-stroke-1 relative z-10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border p-1 dark:border-white/10">
                                <svg fill="none" height="20" viewbox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path class="stroke-secondary dark:stroke-accent" d="M12.5415 4.16665C13.3555 4.32545 14.1035 4.72353 14.6899 5.30993C15.2763 5.89632 15.6744 6.64437 15.8332 7.45831M12.5415 0.833313C14.2326 1.02118 15.8095 1.77846 17.0134 2.98082C18.2173 4.18318 18.9765 5.75915 19.1665 7.44998M18.3332 14.1V16.6C18.3341 16.8321 18.2866 17.0618 18.1936 17.2744C18.1006 17.4871 17.9643 17.678 17.7933 17.8349C17.6222 17.9918 17.4203 18.1112 17.2005 18.1856C16.9806 18.2599 16.7477 18.2875 16.5165 18.2666C13.9522 17.988 11.489 17.1118 9.32486 15.7083C7.31139 14.4289 5.60431 12.7218 4.32486 10.7083C2.91651 8.53432 2.04007 6.05914 1.76653 3.48331C1.7457 3.25287 1.77309 3.02061 1.84695 2.80133C1.9208 2.58205 2.03951 2.38055 2.1955 2.20966C2.3515 2.03877 2.54137 1.90224 2.75302 1.80875C2.96468 1.71526 3.19348 1.66686 3.42486 1.66665H5.92486C6.32929 1.66267 6.72136 1.80588 7.028 2.06959C7.33464 2.3333 7.53493 2.69952 7.59153 3.09998C7.69705 3.90003 7.89274 4.68559 8.17486 5.44165C8.28698 5.73992 8.31125 6.06408 8.24479 6.37571C8.17832 6.68735 8.02392 6.97341 7.79986 7.19998L6.74153 8.25831C7.92783 10.3446 9.65524 12.072 11.7415 13.2583L12.7999 12.2C13.0264 11.9759 13.3125 11.8215 13.6241 11.7551C13.9358 11.6886 14.2599 11.7129 14.5582 11.825C15.3143 12.1071 16.0998 12.3028 16.8999 12.4083C17.3047 12.4654 17.6744 12.6693 17.9386 12.9812C18.2029 13.2931 18.3433 13.6913 18.3332 14.1Z" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="relative z-10">
                                <p class="text-tagline-1 text-secondary dark:text-accent font-normal">Contact Us</p>
                                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">Get in touch with us</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a class="group relative flex items-start gap-2 p-3" href="./terms.html">
                            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background-3 dark:bg-background-7 opacity-0 group-hover:opacity-100 rounded-[10px] z-0 transition-all duration-400"></div>
                            <div class="border-stroke-1 relative z-10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg border p-1 dark:border-white/10">
                                <svg class="stroke-secondary dark:stroke-accent" fill="none" height="18" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewbox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    <polyline points="9 12 11 14 15 10"></polyline>
                                </svg>
                            </div>
                            <div class="relative z-10">
                                <p class="text-tagline-1 text-secondary dark:text-accent font-normal">Terms &amp; Conditions</p>
                                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 font-normal">Our usage terms and legal agreements</p>
                            </div>
                        </a>
                    </li>

                </ul>
            </div>

            <!-- COLUMN 3: What's new (blurred + rounded, matches Works) -->
            <div class="flex-1 flex flex-col">
                <p class="text-tagline-2 text-secondary/60 dark:text-accent/60 px-2 pb-2.5 pt-1 font-semibold uppercase tracking-wide">What&rsquo;s new</p>
                <a href="./album.html#work-nbk111"
                    class="group relative block flex-1 w-full overflow-hidden rounded-[24px] border border-stroke-1 dark:border-white/10 cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 min-h-[220px] bg-[#1a1a1a] isolate"
                    style="transform: translateZ(0); mask-image: radial-gradient(white, black); -webkit-mask-image: -webkit-radial-gradient(white, black);">
                    <div class="absolute inset-0 h-full w-full overflow-hidden rounded-[24px] z-0">
                        <picture>
                            <source srcset="./images/ns-img-485.avif" type="image/avif" />
                            <source srcset="./images/ns-img-485.webp" type="image/webp" />
                            <img alt="NBK111 Glimpse"
                                class="h-full w-full object-cover blur-sm scale-[1.20] transition-transform duration-[900ms] ease-out group-hover:scale-[1.25]"
                                decoding="async" loading="lazy" src="./images/ns-img-485.png"
                                onerror="this.style.display='none'" />
                        </picture>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 rounded-[24px]"></div>
                    </div>
                    <div class="absolute inset-x-0 bottom-0 z-10 p-3">
                        <div class="flex items-center justify-between bg-black/60 backdrop-blur-md p-2 pl-3 rounded-full border border-white/10 shadow-lg group-hover:bg-black/80 transition-colors">
                            <div class="flex flex-col min-w-0 mr-2">
                                <p class="text-[13px] text-white font-medium drop-shadow-lg leading-tight truncate">NBK111 Glimpse</p>
                                <p class="text-[10px] text-white/70 font-normal drop-shadow-md leading-tight truncate mt-0.5">#NBK111 Glimpse - Entry of an Era</p>
                            </div>
                            <div class="group-hover:bg-helix-blue bg-white/20 relative flex h-7 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[40px] transition-all duration-500 ease-in-out">
                                <figure class="relative size-4 overflow-hidden">
                                    <img alt="new-arrow" class="absolute inset-0 size-full -translate-x-4 object-cover transition-transform duration-400 ease-in-out group-hover:translate-x-1" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E" />
                                    <img alt="new-arrow" class="size-full object-cover transition-transform duration-400 ease-in-out group-hover:translate-x-4" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E" />
                                </figure>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

        </div>
    </div>
</li>

                </ul>
            `;
}