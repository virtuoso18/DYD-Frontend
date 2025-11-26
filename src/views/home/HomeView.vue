<template>

  <div>
<!-- main banner section -->
    <a-row>
        <a-col :sm="24" :xs="24" :md="24" :lg="24">
            
      <div
      :style="{
  backgroundImage: `url(${bannerImage})`,
  backgroundPosition: 'center 60%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '800px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}"

      >

      
        <div style="text-align: center;">
  <div class="banner-text" style="border-radius:10px;font-weight:900; padding-top:20px; margin-bottom:24px;">
    <div >
   <div class="text-2xl  font-semibold text-gray-600 my-2">
  {{ t('line1') }}
</div>
<div class="text-center text-2xl text-gray-600 my-2">
  {{ t('line2') }}
</div>
  </div>
  </div>

  <a-button type="primary" size="large"
    style="position:relative; width:210px; height:64px; font-size:28px;"
  >
    <span style="position:absolute;left:-10px;bottom:-10px;font-size:23px">✦</span>
    <span style="position:absolute;top:0px;right:-5px;font-size:15px">✦</span>
    <span style="position:absolute;top:15px;right:5px;font-size:30px">✦</span>
    Join Us
  </a-button>

  <br>

<div style="font-size:16px;font-weight:500;color:#111827;text-decoration:underline;transform: translateY(260px);">
  Click Try Demo
</div>
        </div>
      </div>
        </a-col>
       <a-col :sm="24" :xs="24" :md="24" :lg="24">
  <a-row 
    :gutter="[20, 20]"
    style="width:100%;"
  >       
    <!-- First Card - 95% Cheaper -->
    <a-col :xs="12" :sm="12" :md="4" :lg="4" style="border-radius:10px; padding-top:20px">
      <div
        style="
          background-color:#F9F9F9;
          width:100%;
          height:223px;
          border:1px solid #CCCCCC;
          border-radius:10px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
        "
      >
        <h1 class="card-number" style="font-size:48px; margin:0; font-weight:600;">95%</h1>
        <p class="card-label" style="font-size:16px; margin:8px 0 0 0;">Cheaper</p>
      </div>
    </a-col>
    
    <!-- Second Card - 10,000+ Users -->
    <a-col :xs="12" :sm="12" :md="4" :lg="4" style="border-radius:10px; padding-top:20px">
      <div
        style="
          background-color:#F9F9F9;
          width:100%;
          height:223px;
          border:1px solid #CCCCCC;
          border-radius:10px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
        "
      >
        <h1 class="card-number" style="font-size:48px; margin:0; font-weight:600;">10,000+</h1>
        <p class="card-label" style="font-size:16px; margin:8px 0 0 0;">Users</p>
      </div>
    </a-col>
    
    <!-- Third Card - Features -->
    <a-col :xs="24" :sm="24" :md="16" :lg="16" style="border-radius:10px; padding-top:20px; padding-bottom:40px">
      <div
        style="
          width:100%;
          height:223px;
          background:#F9F9F9;
          border:1px solid #CCCCCC;
          border-radius:10px;
          display:flex;
          justify-content:space-around;
          align-items:center;
          padding:20px;
        "
      >
        <!-- Feature 1 -->
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          gap:12px;
        ">
          <svg width="43" height="54" viewBox="0 0 43 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7727 19.6367L19.0089 22.977C20.6295 27.3571 21.4401 29.5471 23.0377 31.1447C24.6353 32.7423 26.825 33.5527 31.2052 35.1734L34.5455 36.4094L31.2052 37.6455C26.825 39.2662 24.6353 40.0766 23.0377 41.6742C21.4401 43.2718 20.6295 45.4618 19.0089 49.8419L17.7727 53.1822L16.5366 49.8419C14.9159 45.4618 14.1054 43.2718 12.5078 41.6742C10.9102 40.0766 8.72049 39.2662 4.34029 37.6455L1 36.4094L4.34029 35.1734C8.72049 33.5527 10.9102 32.7423 12.5078 31.1447C14.1054 29.5471 14.9159 27.3571 16.5366 22.977L17.7727 19.6367Z" fill="black" stroke="white" stroke-linejoin="round"/>
            <path d="M31.4355 0.5C31.648 0.5 31.837 0.634412 31.9072 0.834961L32.6855 3.06152C33.7211 6.02498 34.199 7.36003 35.1143 8.3291C36.0256 9.29383 37.2756 9.79574 40.0752 10.8926L42.1787 11.7158C42.3702 11.7909 42.496 11.976 42.4961 12.1816C42.4961 12.3874 42.3702 12.5724 42.1787 12.6475L40.0752 13.4717C37.2754 14.5686 36.0256 15.0703 35.1143 16.0352C34.199 17.0042 33.7211 18.3383 32.6855 21.3018L31.9072 23.5283C31.8371 23.729 31.6481 23.8633 31.4355 23.8633C31.223 23.8633 31.034 23.729 30.9639 23.5283L30.1855 21.3018C29.15 18.3383 28.6721 17.0042 27.7568 16.0352C26.8455 15.0703 25.5957 14.5686 22.7959 13.4717L20.6924 12.6475C20.5009 12.5724 20.375 12.3873 20.375 12.1816C20.3751 11.976 20.5009 11.7909 20.6924 11.7158L22.7959 10.8926C25.5955 9.79574 26.8455 9.2938 27.7568 8.3291C28.6721 7.36003 29.15 6.02498 30.1855 3.06152L30.9639 0.834961L30.9951 0.762695C31.0813 0.602674 31.2497 0.500022 31.4355 0.5Z" fill="#3B63FB"/>
          </svg>
          <span style="font-size:14px; font-weight:500;">Instant results</span>
        </div>

        <!-- Feature 2 -->
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          gap:12px;
        ">
          <svg width="58" height="66" viewBox="0 0 58 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29 23.7732L57 38L29 52.2268L0.999995 38L29 23.7732Z" fill="white" stroke="black" stroke-width="2" stroke-linejoin="round"/>
            <path d="M29 13.7732L57 28L29 42.2268L0.999995 28L29 13.7732Z" fill="white" stroke="black" stroke-width="2" stroke-linejoin="round"/>
            <path d="M28.6562 2.83419C28.9151 2.73946 29.2042 2.75559 29.4531 2.88204L57.4531 17.1086C57.7886 17.2791 57.9998 17.6239 58 18.0002C58 18.3766 57.7886 18.7212 57.4531 18.8918L29.4531 33.1184C29.1685 33.263 28.8315 33.263 28.5469 33.1184L0.546875 18.8918C0.211422 18.7212 -2.03761e-08 18.3765 0 18.0002C0.000174813 17.6239 0.211404 17.2791 0.546875 17.1086L28.5469 2.88204L28.6562 2.83419Z" fill="#3B63FB"/>
          </svg>
          <span style="font-size:14px; font-weight:500;">Multi-view staging</span>
        </div>

        <!-- Feature 3 -->
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          gap:12px;
        ">
          <svg width="65" height="46" viewBox="0 0 65 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5742 41.8577H52.5971C55.5259 41.8577 58.3347 40.6802 60.4057 38.5843C62.4766 36.4884 63.6401 33.6458 63.6401 30.6817V23.0006C63.6401 21.3335 62.9857 19.7347 61.821 18.5559C60.6562 17.3771 59.0764 16.7148 57.4292 16.7148C55.782 16.7148 54.2022 17.3771 53.0374 18.5559C51.8727 19.7347 51.2183 21.3335 51.2183 23.0006V26.772C51.2183 27.4388 50.9566 28.0783 50.4907 28.5499C50.0248 29.0214 49.3929 29.2863 48.734 29.2863H16.4374C15.7785 29.2863 15.1466 29.0214 14.6807 28.5499C14.2148 28.0783 13.953 27.4388 13.953 26.772V23.0006C13.953 21.3335 13.2987 19.7347 12.1339 18.5559C10.9691 17.3771 9.38936 16.7148 7.74213 16.7148C6.09491 16.7148 4.51514 17.3771 3.35038 18.5559C2.18561 19.7347 1.53125 21.3335 1.53125 23.0006V30.6817C1.53125 33.6458 2.6947 36.4884 4.76566 38.5843C6.83661 40.6802 9.64543 41.8577 12.5742 41.8577Z" stroke="black" stroke-width="2"/>
            <path d="M57.4293 16.7143C57.4293 13.7914 57.4293 12.3331 57.1901 11.12C56.7109 8.68116 55.5278 6.44093 53.7905 4.68264C52.0531 2.92436 49.8395 1.727 47.4297 1.242C46.231 1 44.7901 1 41.9021 1H23.2694C20.3813 1 18.9404 1 17.7417 1.242C15.3319 1.727 13.1183 2.92436 11.381 4.68264C9.64364 6.44093 8.46053 8.68116 7.98131 11.12C7.74219 12.3331 7.74219 13.7914 7.74219 16.7143" stroke="black" stroke-width="2"/>
            <path d="M57.4293 45.0022V41.8594M7.74219 45.0022V41.8594" stroke="black" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span style="font-size:14px; font-weight:500;">Furniture removal</span>
        </div>
      </div>
    </a-col>
  </a-row>
</a-col>
    </a-row>
<catalog/>
<!-- Unlock the potential section -->
    <a-row  style="padding-left:10px;;padding-right:10px">
        <a-col :span="24" style="font-size:24px;font-weight:bold;margin:auto;width:100%;text-align: center;">
            <div class="banner-text">Unlock the potential of</div>
            <div class="banner-text"><span style="background-color: #3B63FB;color:white;border-radius:10px;padding-left:10px;padding-right:10px;font-weight:bold;position:relative">DYD
                <span style="color:#3B63FB;position:absolute;bottom:15px;left:-20px;font-size:20px">✦</span>
                <span style="color:black;position:absolute;bottom:-20px;left:-15px;font-size:35px">✦</span>
            </span> for your needs.</div>
<br>
            <div style="position:relative;display: flex;justify-items: center;">
                <img src="../../assets/home_main_banner.jpg" style="max-width:900px;width:100%;border-radius:20px;max-height:600px;margin:auto" alt="" />
<a-button 
  type="primary" 
  style="
    position:absolute;
    bottom:30px;
    left:50%;
    transform: translateX(-50%);
    width:309px;
    background:#3B63FB;
    border-color:#3B63FB;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
  "
>
  Process photo 
  <img src="/ai-generative.svg" alt="Share" />
</a-button>            </div>
            <br>
        </a-col>
    </a-row>

<!-- Unlock the potential section -->

    <a-row style="padding-left:10px;background: #f2f2f2;;padding-right:10px">
        <a-col :span="24"  style="max-width:1200px;margin:auto;padding:20px;">
            <div >
            <br>
            <br>
            <br>

    <div style="color:black;margin:0;padding:0" class="banner-text">The Smart Platform for Virtual Staging</div>
    <div style="color:black;margin:0;padding:0" class="banner-text">and Realistic Home Design </div>
    <div style="color:black;margin:0;padding:0" class="banner-text">Visualizations</div>
    <div style="font-size:20px;color:grey">
        DYD is an advanced AI platform for business owners, store owners, 
        <br>interior designers, and architects, offering interactive, 
        <br>personalized virtual staging visualizations to showcase products effectively.

</div>
            </div>
        </a-col>
        <a-col :span="24"   style="max-width:1200px;margin:auto">
            <a-row>
                <a-col :sm="24" :xs="24" :md="12" :lg="12">
                    <br>
                    <div style="border-radius:20px;;background-color: white;border:3px dotted grey ;height:350px;width:100%;;display:flex;flex-direction:column;justify-content: center;align-items: center;font-size:18px;">
                        
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5333 4.70117V15.147M12.5333 4.70117C11.8019 4.70117 10.4353 6.78438 9.92188 7.31262M12.5333 4.70117C13.2647 4.70117 14.6314 6.78438 15.1448 7.31262" stroke="black" stroke-width="1.88285" stroke-linecap="square" stroke-linejoin="round"/>
<path d="M20.8929 17.2363C20.8929 19.829 20.3519 20.3701 17.7592 20.3701H7.31342C4.72078 20.3701 4.17969 19.829 4.17969 17.2363" stroke="black" stroke-width="1.88285" stroke-linecap="square" stroke-linejoin="round"/>
</svg>
<br>
Drag & drop Image
<br>
<br>
                        <a-button type="primary">Upload Image</a-button>
                    </div>
                </a-col>
                <a-col :sm="24" :xs="24" :md="12" :lg="12">
                   <div style="border-radius:20px;height:400px;max-width:450px;width:90%;margin:auto;display:flex;flex-direction:column;justify-content: center;align-items: center;font-size:18px;padding:20px;">
                        
                        <p>or use an example image</p>
                        <a-space  class="no-scrollbar" style="overflow-x: auto;max-width:340px;">
                            <a-button>Living Room</a-button>
                            <a-button>Kitchen</a-button>
                            <a-button>Bedroom</a-button>
                            <a-button>Dianing Room</a-button>
                            <a-button>Outdoor</a-button>
                           
                        </a-space>
                        <br>
                         <div style="display:flex;gap:10px;overflow-x:hidden;width:100%;">
                                <img src="../../assets/home_main_banner.jpg" style="border-radius:10px;width:150px;height:100px;" alt="">
                                <img src="../../assets/home_main_banner.jpg" style="border-radius:10px;width:150px;height:100px;" alt="">
                                <img src="../../assets/home_main_banner.jpg" style="border-radius:10px;width:150px;height:100px;" alt="">
                                <img src="../../assets/home_main_banner.jpg" style="border-radius:10px;width:150px;height:100px;" alt="">
                            </div>
                        <br>

                    <a-button type="primary" block>Try For Free</a-button>
                    <h6>No Credit Required</h6>
                    </div>
                </a-col>
            </a-row>
        </a-col>
    </a-row>

    
    <br>
    <a-row style="background:#3B63FB;height:300px;">
        <a-col :sm="12" :xs="12" :md="6" :lg="6" style="color:white;display:flex;justify-content: center;align-items: center;flex-direction: column;">
            <div  class="banner-text" style="color:white">
                30+
            </div>
            <h3>Partnered Brands</h3>
<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.91797C14.4769 2.91797 10.0369 3.74514 9.17292 7.13526C8.40831 10.1353 8.58613 12.2802 10.4907 14.8277L21.7109 29.8363C22.8397 31.3461 23.4042 32.1011 24.1685 32.0843C24.933 32.0676 25.4624 31.2887 26.5213 29.7307L27.2923 28.5963C28.6159 26.6487 29.2778 25.6748 29.1514 24.6223C29.0251 23.5699 28.1508 22.7735 26.4021 21.1807L9.91537 5.83464" stroke="white"/>
<path d="M17.4948 2.91797C20.5178 2.91797 24.9578 3.74514 25.8219 7.13526C26.5865 10.1353 26.4087 12.2802 24.5041 14.8277L22.5053 17.5013M25.0794 5.83464L17.4948 12.8945M17.4948 24.2037L13.2838 29.8363C12.155 31.3461 11.5906 32.1011 10.8262 32.0843C10.0618 32.0676 9.53239 31.2887 8.47357 29.7307L7.70256 28.5963C6.37891 26.6487 5.71704 25.6748 5.84338 24.6223C5.96971 23.5699 6.84404 22.7735 8.5927 21.1807L12.5456 17.5013" stroke="white"/>
</svg>

        </a-col>
        <a-col :sm="12" :xs="12" :md="6" :lg="6" style="color:white;display:flex;justify-content: center;align-items: center;flex-direction: column;">
            <div  class="banner-text" style="color:white">
                2020
            </div>
            <h3>Ecommerce Since</h3>
<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6667 23.3346H22.2588C28.8033 23.3346 29.7986 19.2233 31.0056 13.227C31.3539 11.4975 31.528 10.6327 31.1093 10.0566C30.6906 9.48047 29.8881 9.48047 28.2831 9.48047H8.75" stroke="white" stroke-width="1.25" stroke-linecap="round"/>
<path d="M11.6615 23.3346L7.83877 5.12724C7.51418 3.82883 6.34755 2.91797 5.0092 2.91797H3.64062" stroke="white" stroke-width="1.25" stroke-linecap="round"/>
<path d="M12.95 23.332H12.35C10.3618 23.332 8.75 25.011 8.75 27.082C8.75 27.4272 9.01862 27.707 9.35 27.707H25.5208" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.3125 32.082C16.5206 32.082 17.5 31.1027 17.5 29.8945C17.5 28.6864 16.5206 27.707 15.3125 27.707C14.1044 27.707 13.125 28.6864 13.125 29.8945C13.125 31.1027 14.1044 32.082 15.3125 32.082Z" stroke="white" stroke-width="1.25"/>
<path d="M25.5156 32.082C26.7237 32.082 27.7031 31.1027 27.7031 29.8945C27.7031 28.6864 26.7237 27.707 25.5156 27.707C24.3075 27.707 23.3281 28.6864 23.3281 29.8945C23.3281 31.1027 24.3075 32.082 25.5156 32.082Z" stroke="white" stroke-width="1.25"/>
</svg>

        </a-col>
        <a-col :sm="12" :xs="12" :md="6" :lg="6" style="color:white;display:flex;justify-content: center;align-items: center;flex-direction: column;">
            <div  class="banner-text" style="color:white">
                10M+
            </div>
            <h3>Global Impressions</h3>
<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5052 32.0846C25.5594 32.0846 32.0885 25.5555 32.0885 17.5013C32.0885 9.44715 25.5594 2.91797 17.5052 2.91797C9.45106 2.91797 2.92188 9.44715 2.92188 17.5013C2.92188 25.5555 9.45106 32.0846 17.5052 32.0846Z" stroke="white" stroke-width="1.25"/>
<path d="M11.0781 17.5C12.1091 9.25911 14.4636 3.5 17.2031 3.5C19.9427 3.5 22.2971 9.25911 23.3281 17.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.0781 17.5C12.1091 25.7409 14.4636 31.5 17.2031 31.5C19.9427 31.5 22.2971 25.7409 23.3281 17.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.92188 17.5H11.0885M32.0885 17.5H23.3385" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </a-col>
        <a-col :sm="12" :xs="12" :md="6" :lg="6" style="color:white;display:flex;justify-content: center;align-items: center;flex-direction: column;">
            <div  class="banner-text" style="color:white">
                75%
            </div>
            <h3>Faster Sales</h3>
<svg width="21" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.57749 15.4823H4.90818C2.7444 15.4823 1.66251 15.4823 1.20136 14.7689C0.740202 14.0556 1.1796 13.0618 2.05839 11.0741L4.70036 5.09846C5.49937 3.29125 5.89888 2.38764 6.67391 1.88132C7.44894 1.375 8.43256 1.375 10.4 1.375H13.447C15.837 1.375 17.0319 1.375 17.4825 2.15572C17.9333 2.93644 17.3405 3.97941 16.1547 6.06534L14.5915 8.81524C14.0021 9.85222 13.7074 10.3707 13.7114 10.7951C13.7168 11.3467 14.0101 11.8549 14.4839 12.1331C14.8485 12.3474 15.4425 12.3474 16.6306 12.3474C18.1325 12.3474 18.8836 12.3474 19.2747 12.6074C19.7828 12.9451 20.0488 13.5495 19.9556 14.1547C19.8838 14.6205 19.3787 15.179 18.3683 16.2962L10.2963 25.2221C8.71081 26.9753 7.91806 27.8519 7.38572 27.5745C6.85337 27.297 7.10902 26.1407 7.62027 23.8278L8.62185 19.2973C9.01108 17.5362 9.20577 16.6557 8.73764 16.069C8.26952 15.4823 7.37216 15.4823 5.57749 15.4823Z" stroke="white" stroke-width="1.25" stroke-linejoin="round"/>
</svg>

        </a-col>
    </a-row>

    <br>
    
   <div className="hidden lg:block">
     <div class="header">
        <h1 class="header-title">
          Get listing-ready results in seconds
        </h1>
        <p class="header-text">Turn your property photos into stunning visuals in three simple</p>
        <p class="header-text">steps to attract buyers and enhance your listings.</p>
      </div>
    <div class="section-container">
      
      <!-- Header -->
     

      <!-- Steps Wrapper -->
      <div class="steps-wrapper">
        
        <!-- Step 1 Text -->
        <div class="step-text-container">
          <div class="step-content">
            <h2 class="step-title">Upload</h2>
            <p class="step-description">We support both furnished</p>
            <p class="step-description">and unfurnished photos.</p>
          </div>
        </div>

        <!-- Step 1 Image -->
        <div class="step-image-container">
          <div class="image-box step1-box">
            <!-- Step Number on Top Left -->
            <span class="step-number step1-number"><img src="/01 (1).svg" alt="Share"  /></span>
            <img src="/upload-04.svg" alt="Share"  />
            <span class="drag-text">Drag and drop</span>
            <div class="overlay-box"></div>
          </div>
        </div>

        <!-- SVG Line 1 -->
        <div class="svg-line line1">
          <img src="/firstline.svg" alt="line" class="line-image" />
        </div>

        <!-- Step 2 Image -->
        <div class="step-image-container step2-image">
          <div class="image-box step2-box">
            <!-- Step Number on Top Right -->
            <span class="step-number step2-number"><img src="/02.svg" alt="Share"  /></span>
            <div class="ai-badge">
              <span><img src="/addingfurniture.svg" alt="Share"  /></span> Adding furniture..
            </div>
          </div>
        </div>

        <!-- Step 2 Text -->
        <div class="step-text-container step2-text">
          <div class="step-content">
            <div class="step2-content-inner">
              <h2 class="step-title">AI Finished</h2>
              <p class="step-description">Our AI redesigns your space</p>
              <p class="step-description">in 15 seconds.</p>
            </div>
          </div>
        </div>

        <!-- SVG Line 2 -->
        <div class="svg-line line2">
          <img src="/secondline.svg" alt="line" class="line-image" />
        </div>

        <!-- Step 3 Text -->
        <div class="step-text-container step3-text">
          <div class="step-content">
            <h2 class="step-title " style="font-size:32px; font-weight:500;">Download & Share</h2>
            <p class="step-description">Download the staged photo</p>
            <p class="step-description">and share it anywhere.</p>
          </div>
        </div>

        <!-- Step 3 Image -->
        <div class="step-image-container step3-image">
          <div class="image-box step3-box">
            <!-- 03 Number -->
            <span class="step-number step3-number"><img src="/03.svg" alt="Share"  /></span>
            <!-- Buttons half inside / half outside -->
             <div class="action-buttons">
                <button class="action-btn">
                   <img src="/download.svg" alt="Download"  />
                    </button>
                    <button class="action-btn">
                   <img src="/share.svg" alt="Share"/>
                </button>
              </div>
          </div>
        </div>

      </div>
    </div>
  </div>
    <br>

    <div class="lg:hidden w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="text-center mb-16">
      <h1 class="!font-proza-libre font-black text-3xl sm:text-4xl lg:text-5xl text-black mb-5">
        Get listing-ready results in seconds
      </h1>
      <p class="!font-poppins text-base text-gray-500 leading-relaxed">
        Turn your property photos into stunning visuals in three simple
      </p>
      <p class="font-poppins text-base text-gray-500 leading-relaxed">
        steps to attract buyers and enhance your listings.
      </p>
    </div>

    <!-- Steps Container -->
    <div class="max-w-6xl mx-auto px-3 sm:px-6 relative">
      
      <!-- Step 1: Upload -->
      <div class="flex flex-col lg:flex-row items-center gap-8 mb-24 lg:mb-32">
        
        <!-- Step 1 Text -->
       <div class="flex w-full justify-between pt-12 items-start">

  <!-- LEFT SIDE -->
  <div>
    <h2 class="!font-proza-libre font-semibold text-3xl sm:text-4xl text-black mb-2 mt-20 lg:mt-0">
      Upload
    </h2>
    <p class="font-poppins text-gray-500 leading-snug">
      We support both furnished
    </p>
    <p class="font-poppins text-gray-500 leading-snug">
      and unfurnished photos.
    </p>
  </div>

  <!-- RIGHT SIDE -->
  <div>
    <img 
      src="/01 (1).svg" 
      alt="Step 1" 
      class="w-20 h-20 sm:w-24 sm:h-24"
    />
  </div>

</div>


        <!-- Step 1 Image -->
       <div class="w-full lg:w-1/2 flex justify-center">
  <div class="relative w-full max-w-md">
    
    <!-- Image Box -->
    <div class="bg-black rounded-3xl w-full aspect-video sm:aspect-auto h-64 flex flex-col items-center justify-center relative ">
      <img src="/upload-04.svg" alt="Upload" class="w-6 h-6 -translate-x-18" />
      <span class="text-gray-400 text-sm -translate-x-18 font-poppins">Drag and drop</span>
      
      <!-- Overlay Box Positioned Bottom Right -->
      <div 
        class="absolute -bottom-8 -right-8 w-2/3 h-48 rounded-2xl bg-cover bg-no-repeat bg-bottom pointer-events-none"
        style="background-image: url('/thirdcardbg.svg');"
      ></div>
    </div>

  </div>
</div>

      </div>

      

      <!-- Step 2: AI Finished -->
      <div class="flex flex-col lg:flex-row-reverse items-center gap-8 pt-24 relative z-10">
        
        <!-- Step 2 Text -->
           <div class="flex w-full justify-between pt-12 items-start">

  <!-- LEFT SIDE -->
  <div>
    <h2 class="!font-proza-libre font-semibold text-3xl sm:text-4xl text-black mb-2 mt-20 lg:mt-0">
                    AI Finished

    </h2>
    <p class="font-poppins text-gray-500 leading-snug">
              Our AI redesigns your space
    </p>
    <p class="font-poppins text-gray-500 leading-snug">
              in 15 seconds.
    </p>
  </div>

  <!-- RIGHT SIDE -->
  <div>
    <img 
      src="/02.svg" 
      alt="Step 1" 
      class="w-20 h-20 sm:w-24 sm:h-24"
    />
  </div>

</div>

        <!-- Step 2 Image -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div class="relative w-full max-w-sm">
            <!-- Step Number -->
            
            
            <!-- Image Box -->
            <div 
              class="rounded-2xl w-full aspect-video sm:aspect-auto sm:h-64 flex items-center justify-center relative bg-cover bg-center"
              style="background-image: url('/thirdcardbg.svg');"
            >
              <!-- AI Badge -->
              <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-poppins text-sm font-semibold shadow-lg z-30">
                <img src="/addingfurniture.svg" alt="Adding" class="w-4 h-4" />
                <span>Adding furniture..</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <!-- Step 3: Download & Share -->
      <div class="flex flex-col lg:flex-row items-center pt-14 gap-8 relative z-10">
        
        <!-- Step 3 Text -->
              <div class="flex w-full justify-between pt-12 items-start">

  <!-- LEFT SIDE -->
  <div>
    <h2 class="!font-proza-libre font-semibold text-3xl sm:text-4xl text-black mb-2 mt-20 lg:mt-0">
              Download & Share

    </h2>
    <p class="font-poppins text-gray-500 leading-snug">
              Download the staged photo
    </p>
    <p class="font-poppins text-gray-500 leading-snug">
              and share it anywhere.
    </p>
  </div>

  <!-- RIGHT SIDE -->
  <div>
    <img 
      src="/03.svg" 
      alt="Step 1" 
      class="w-20 h-20 sm:w-24 sm:h-24"
    />
  </div>

</div>

        <!-- Step 3 Image -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <div class="relative w-full max-w-sm">
            <!-- Step Number -->
           
            
            <!-- Image Box -->
            <div 
              class="rounded-2xl w-full aspect-video sm:aspect-auto sm:h-64 flex items-center justify-center relative bg-cover bg-center"
              style="background-image: url('/thirdcardbg.svg');"
            >
              <!-- Action Buttons -->
              <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
                <button 
                  class="bg-transparent border-0 cursor-pointer p-0 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Download"
                >
                  <img src="/download.svg" alt="Download" class="w-10 h-10 sm:w-12 sm:h-12" />
                </button>
                <button 
                  class="bg-transparent border-0 cursor-pointer p-0 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Share"
                >
                  <img src="/share.svg" alt="Share" class="w-10 h-10 sm:w-12 sm:h-12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>


    
    <div
      :style="{
  backgroundImage: `url(${swiper_bg})`,
  backgroundPosition: 'center 90%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '700px',
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'end'
}"

      >
        <div style="text-align: center;width:100%;padding-top:100px;">
          
          <!-- <div>{{ business_info.name }}</div> -->
            <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
          <!-- <h1>SWIPER-CHAIRS-HERE</h1> -->
          
 <swiper style="margin-top:50px;"
    :modules="modules"
    :slides-per-view="1"
    :space-between="50"
    navigation
    Autoplay 
    :pagination="{ clickable: true }"
    
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
 <swiper-slide>
  <div style="width:100%; display:flex;justify-content: center;align-items: center;">
    <img src="../../assets/ch_1_home_page.png" style="max-width:450px;width:100%;object-fit: contain;" alt="">
    <!-- <a-row>
      <a-col :sm="24" :xs="24" :md="12" :lg="12">
      </a-col>
      <a-col :sm="24" :xs="24" :md="12" :lg="12">
        <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
      </a-col>
    </a-row> -->
  </div>
 </swiper-slide>
    <swiper-slide>
      <div  style="width:100%; display:flex;justify-content: center;align-items: center;">
        <img src="../../assets/ch_2_home_page.png" style="max-width:350px;width:100%;object-fit: contain;" alt="">
        <!-- <a-row>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
          </a-col>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
          </a-col>
        </a-row> -->
      </div>
    </swiper-slide>
    <swiper-slide>
      <div style="width:100%; display:flex;justify-content: center;align-items: center;">
        <img src="../../assets/ch_3_home_page.png" style="max-width:400px;width:100%;object-fit: contain;" alt="">
        <!-- <a-row>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
          </a-col>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
          </a-col>
        </a-row> -->
      </div>
    </swiper-slide>
  </swiper>
          
        </div>
      </div>





      <!-- virtual staging part  -->

<br>
    <a-row style="max-width:1200px;margin:auto;padding-left:10px;padding-right:10px">
         <a-col :sm="24" :xs="24" :md="9" :lg="9" style="display:flex;justify-content: center;align-items: start;flex-direction:column">
            <h1>Virtual Staging</h1>
            <p style="margin:0">With the help of virtual staging, you can create realistic, </p>
<p style="margin:0">digital previews of spaces, providing a cost-effective solution </p>
<p style="margin:0">for real estate and design.</p>
<br>
<div className="pb-4">

  <a-button type="primary" style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap;">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.3385 1.33398L11.5351 1.86505C11.7927 2.56143 11.9216 2.90962 12.1756 3.16362C12.4296 3.41762 12.7777 3.54646 13.4741 3.80414L14.0052 4.00065L13.4741 4.19716C12.7777 4.45484 12.4296 4.58369 12.1756 4.83768C11.9216 5.09168 11.7927 5.43987 11.5351 6.13625L11.3385 6.66732L11.142 6.13625C10.8843 5.43988 10.7555 5.09168 10.5015 4.83768C10.2475 4.58368 9.89934 4.45484 9.20294 4.19716L8.67188 4.00065L9.20294 3.80414C9.89934 3.54646 10.2475 3.41762 10.5015 3.16362C10.7555 2.90962 10.8843 2.56143 11.142 1.86505L11.3385 1.33398Z" stroke="white" stroke-linejoin="round"/>
  <path d="M4 2.66602L4.14739 3.06432C4.34065 3.5866 4.43728 3.84774 4.62778 4.03824C4.81827 4.22874 5.07942 4.32537 5.6017 4.51863L6 4.66602L5.6017 4.8134C5.07942 5.00666 4.81827 5.1033 4.62777 5.2938C4.43728 5.48429 4.34065 5.74544 4.14739 6.26772L4 6.66602L3.85261 6.26772C3.65935 5.74544 3.56272 5.48429 3.37222 5.2938C3.18173 5.1033 2.92058 5.00666 2.3983 4.8134L2 4.66602L2.3983 4.51863C2.92058 4.32537 3.18173 4.22874 3.37222 4.03824C3.56272 3.84774 3.65935 3.5866 3.85261 3.06432L4 2.66602Z" stroke="white" stroke-linejoin="round"/>
  </svg>
  
  
      Try Virtual Staging</a-button>
</div>
        </a-col>
        <a-col :sm="24" :xs="24" :md="15" :lg="15">
            <div style="width:100%;height:300px;border-radius:10px;;background-color:#f2f2f2">
                img_here
            </div>
        </a-col>

        
        <a-col :sm="24" :xs="24" :md="15" :lg="15" style="margin-top:20px;">
            <div style="width:100%;height:300px;border-radius:10px;;background-color:#f2f2f2">
                img_here
            </div>
        </a-col>
         <a-col :sm="24" :xs="24" :md="9" :lg="9" style="display:flex;justify-content: center;align-items: start;flex-direction:column;margin-top: 20px;padding-left:20px">
            <h1>3D Rendering</h1>
             
            <p style="margin:0">We are helping you create stunning 3D renderings of </p>
<p style="margin:0">furniture by transforming 3D models into realistic,</p>
<p style="margin:0">detailed images using advanced software.</p>
<br>
<a-button type="primary" style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap;">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.3385 1.33398L11.5351 1.86505C11.7927 2.56143 11.9216 2.90962 12.1756 3.16362C12.4296 3.41762 12.7777 3.54646 13.4741 3.80414L14.0052 4.00065L13.4741 4.19716C12.7777 4.45484 12.4296 4.58369 12.1756 4.83768C11.9216 5.09168 11.7927 5.43987 11.5351 6.13625L11.3385 6.66732L11.142 6.13625C10.8843 5.43988 10.7555 5.09168 10.5015 4.83768C10.2475 4.58368 9.89934 4.45484 9.20294 4.19716L8.67188 4.00065L9.20294 3.80414C9.89934 3.54646 10.2475 3.41762 10.5015 3.16362C10.7555 2.90962 10.8843 2.56143 11.142 1.86505L11.3385 1.33398Z" stroke="white" stroke-linejoin="round"/>
<path d="M4 2.66602L4.14739 3.06432C4.34065 3.5866 4.43728 3.84774 4.62778 4.03824C4.81827 4.22874 5.07942 4.32537 5.6017 4.51863L6 4.66602L5.6017 4.8134C5.07942 5.00666 4.81827 5.1033 4.62777 5.2938C4.43728 5.48429 4.34065 5.74544 4.14739 6.26772L4 6.66602L3.85261 6.26772C3.65935 5.74544 3.56272 5.48429 3.37222 5.2938C3.18173 5.1033 2.92058 5.00666 2.3983 4.8134L2 4.66602L2.3983 4.51863C2.92058 4.32537 3.18173 4.22874 3.37222 4.03824C3.56272 3.84774 3.65935 3.5866 3.85261 3.06432L4 2.66602Z" stroke="white" stroke-linejoin="round"/>
</svg>


    Try 3D Rendering</a-button>
        </a-col>

    </a-row>

    <br><br>
    
<br><br>
<div className="hidden sm:block" style="background:#f2f2f2;">


<div style="max-width:1300px;margin:auto;">
     <div style="padding:40px 10px;text-align:center;overflow:hidden;position:relative;">

    <h1 style="font-size:28px;font-weight:700;margin-bottom:40px;">See What Customers Love About Us</h1>
    
    <swiper
      style="margin-top:20px;padding-bottom:50px;overflow:visible;cursor:pointer"
      :modules="modules"
      :slides-per-view="slidesPerView"
      :space-between="30"
      :centered-slides="true"
            :initial-slide="2"

      navigation
      :pagination="{ clickable: true }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(review, index) in reviews" :key="index">
        <div style="padding:20px;border-radius:12px;text-align:left;width:100%;max-width:280px;margin:auto;">
          <div style="display:flex;align-items:center;margin-bottom:15px;">
            <img :src="review.avatar" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;margin-right:10px;">
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600;color:#111;">{{ review.name }}</h3>
              <p style="margin:0;font-size:13px;color:#666;">{{ review.role }}</p>
            </div>
          </div>
          <p style="font-size:14px;line-height:1.5;color:#333;margin:0;">“{{ review.text }}”</p>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Fade effect overlays -->
    <div style="position:absolute;top:0;left:0;width:200px;height:100%;background:linear-gradient(to right,#f3f3f3,transparent);z-index:5;pointer-events:none;"></div>
    <div style="position:absolute;top:0;right:0;width:200px;height:100%;background:linear-gradient(to left,#f3f3f3,transparent);z-index:5;pointer-events:none;"></div>
      </div>
  </div>
</div>

 <div class="block sm:hidden w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12">
        See What Customers Love About Us
      </h1>

      <!-- Testimonials Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
        
        <!-- Testimonial Card 1 -->
        <div class="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-6">
            <img 
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
              alt="Amy Lang"
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <div>
<h3 class="font-poppins font-semibold text-gray-900 [font-size:14px!important] [line-height:20px!important] [letter-spacing:0!important]">
  Amy Lang
</h3>
              <p class="text-gray-600 text-xs sm:text-sm">Home Stager</p>
            </div>
          </div>
          <p class="!font-poppins !font-normal !text-[14px] leading-[20px] tracking-[0px] text-gray-700">
  "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly."
</p>

        </div>

        <!-- Testimonial Card 2 -->
        <div class="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-6">
            <img 
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
              alt="Troy Sinclair"
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Troy Sinclair</h3>
              <p class="text-gray-600 text-xs sm:text-sm">Real Estate Photographer</p>
            </div>
          </div>
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
            "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly. It has taken our real estate marketing to the next level!"
          </p>
        </div>

        <!-- Testimonial Card 3 -->
        <div class="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-6">
            <img 
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
              alt="Amy Lang"
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Amy Lang</h3>
              <p class="text-gray-600 text-xs sm:text-sm">Home Stager</p>
            </div>
          </div>
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
            "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly."
          </p>
        </div>

        <!-- Testimonial Card 4 -->
        <div class="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-6">
            <img 
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
              alt="Amy Lang"
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Amy Lang</h3>
              <p class="text-gray-600 text-xs sm:text-sm">Home Stager</p>
            </div>
          </div>
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
            "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly."
          </p>
        </div>

      </div>
    </div>
  </div>


<div style="padding:10px;max-width:1200px;margin:auto;">
  <br><br><br>
  <h1 style="text-align:center">Got questions? We have answers</h1><br>
  <div style="margin:50px auto;padding:0 20px;">
    <a-collapse
      v-model:activeKey="expand_faq"
      accordion
      style="background:#fff;border:none;font-size:18px;"
    >
      <a-collapse-panel key="1" header="What is virtual staging?" > 
        <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
          Virtual staging is a process of using computer technology to furnish and decorate real estate photos digitally.
        </p>
      </a-collapse-panel>

      <a-collapse-panel key="2" header="Why should I pick virtual staging over physical staging?">
        <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
          Virtual staging offers several advantages over physical staging. It’s more cost-effective, as it eliminates the need for furniture rentals and setup. It’s also faster, allowing for quicker turnaround times and adjustments to suit different buyer preferences. Additionally, virtual staging is highly flexible, enabling you to create multiple design styles and settings without the physical limitations of a space.
        </p>
      </a-collapse-panel>

      <a-collapse-panel key="3" header="What is AI virtual staging?">
        <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
          AI virtual staging uses artificial intelligence models to automatically place furniture and décor in photos, saving time while creating realistic results.
        </p>
      </a-collapse-panel>

      <a-collapse-panel key="4" header="What kind of photos do you support?">
        <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
          We support wide-angle interior property photos such as living rooms, bedrooms, dining areas, and more.
        </p>
      </a-collapse-panel>

      <a-collapse-panel key="5" header="How long does it take to virtually stage by AI?">
        <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
          AI staging usually takes just a few minutes, depending on the complexity of the design and processing load.
        </p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</div>
<div class="flex justify-center items-center">
        <div class="bg-white p-6 sm:p-6 rounded-xl shadow-[0_20px_60px_rgba(59,130,246,0.4)] max-w-[450px] w-full border-t-[3px] border-blue-500">
          <form @submit.prevent="submitForm" class="flex flex-col gap-5 ">
            <div class="flex gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="Enter name"
                v-model="form.name"
                class="flex-1 py-3 px-1 sm:px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                style="width:100%"
              />
              <input
                type="email"
                placeholder="Your email"
                v-model="form.email"
                class="flex-1 py-3 px-1 sm:px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                style="width:100%"
              />
            </div>

            <textarea
              placeholder="Your text"
              v-model="form.message"
              class="w-full min-h-[120px] py-3 px-3.5 border border-gray-300 rounded-md text-sm resize-y outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            ></textarea>

            <button
              type="submit"
              class="bg-blue-500 text-white py-3.5 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 w-full hover:bg-blue-600 active:scale-95"
            >
              Send now
            </button>
          </form>
        </div>
      </div>
      <br>
      <br>
      <br>
  </div>
</template>

<script>
import bannerImage from '@/assets/home_main_banner.jpg'
import { useI18n } from 'vue-i18n'

import swiper_bg from '@/assets/bg-swiper.jpg'

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import catalog from "@/views/newhome/catalog.vue"
export default {
  name: "Home",
  setup() {
    // ✅ initialize vue-i18n for translations
    const { t } = useI18n()

    const onSwiper = (swiper) => console.log(swiper)
    const onSlideChange = () => console.log('slide change')

    return {
      t, // ✅ expose translation function to template
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination, Scrollbar, A11y, Autoplay],
    }
  },
  data() {
    return {
      bannerImage,
            swiper_bg,
            expand_faq:'1',
            slidesPerView : window.innerWidth <= 768 ? 1 : 4,
            
            form :{
                name: "",
            email: "",
            message: ""},
                reviews :[
                {
                    name: "Amy Lang",
                    role: "Home Stager",
                    text: "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly.",
                    avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                },
                {
                    name: "Troy Sinclair",
                    role: "Real Estate Photographer",
                    text: "It has taken our real estate marketing to the next level! Our buyers love the virtual staging.",
                    avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                },
                {
                    name: "John Doe",
                    role: "Interior Designer",
                    text: "This tool made it so easy to stage homes and present them to clients with realistic visuals.",
                    avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                },
                {
                    name: "Sarah Lee",
                    role: "Realtor",
                    text: "My listings now stand out. Clients are impressed with how professional everything looks.",
                    avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                },
                {
                    name: "David Kim",
                    role: "Architect",
                    text: "An incredible platform for showcasing designs and spaces realistically.",
                    avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
            ]
    }
  },
 
  components:{
         Swiper,
      SwiperSlide,
      catalog
  },
  methods:{
     submitForm() {
  console.log("Form submitted:", form);
  alert("Message sent!");
}
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;500;600;700;800;900&display=swap');

.banner-text {
  font-family: "Proza Libre", sans-serif !important;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 900; /* Use 800 or 900 as needed */
}

/* Tablet */
@media (min-width: 768px) {
  .banner-text {
    font-size: 36px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .banner-text {
    font-size: 44px;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&family=Poppins:wght@400;700&display=swap');

/* Example class for number (95%) */
.card-number {
  font-family: "Public Sans", sans-serif !important;
  font-weight: 700;
  font-size: 48px;
  line-height: 52px;
  letter-spacing: -2%;
  color: #3B63FB;
  margin: 0;
  text-align: center;
}

/* Example class for text (Cheaper) */
.card-label {
  font-family: "Poppins", sans-serif !important;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -2%;
  color: #000;
  margin: 4px 0 0 0;
  text-align: center;
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

.icon-text {
  font-family: "Poppins", sans-serif !important;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
}

@import url('https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;600;700&family=Rubik:wght@500&display=swap');

.section-container {
  background-color: white;
  max-width: 1200px;
  margin: 0 ;
  padding: 40px 12px;
  position: relative;
  font-family: 'Proza Libre', sans-serif;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 64px;
  

}

.header-title {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0 auto;/* centers the h1 */
  text-align: center; /* ensures text stays centered */
}
.header-text {
  font-size: 16px;
  color: #6b7280;
}

/* Steps Wrapper */
.steps-wrapper {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}

/* Step Text Container */
.step-text-container {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.step-content {
  position: relative;
}

.step-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
   margin-top: 80px;
  color: #000; 
}

.step-description {
  color: #6b7280;
  line-height: 1.2;
}

/* Step Image Container */
.step-image-container {
  width: 50%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Image Box */
.image-box {
  width: 415px;
  height: 275px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Step 1 Specific */
.step1-box {
  background-color: black;
  border-radius: 26px; 
}

.step1-number {
  font-size: 125px;
  font-weight: 300;
  color: #d1d5db;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.drag-text {
  color: #9ca3af;
  font-size: 14px;
}

.overlay-box {
  position: absolute;
  top: 64px;
  left: 320px;
  width: 274px;
  height: 213px;
 background-image: url("/thirdcardbg.svg");
  border-radius: 16px;
  transform: translateY(24px);
  overflow: visible;
}

/* SVG Lines */
.svg-line {
  position: absolute;
  width: 260px;
  height: 320px;
  display: flex;
  justify-content: center;
  z-index: 0;
}

.line1 {
  left: 50%;
  transform: translate(8%, 80px);
}

.line2 {
  left: 50%;
  top: 760px;
  transform: translate(10%, -75%);
}

.line-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Step 2 Specific */
.step2-image {
  transform: translateX(320px);
  margin-top: 120px;
}

.step2-box {
 background-image: url("/thirdcardbg.svg");
}

.step2-number {
  font-size: 125px;
  color: #4b5563;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.ai-badge {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  background-color: #4F6EF7;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;
}

.step2-text {
  transform: translateX(40px);
  margin-top: 80px;
}

.step2-content-inner {
  transform: translateX(160px);
}

/* Step 3 Specific */
.step3-text {
  margin-top: 120px;
}

.step3-bg-number {
  font-size: 80px;
  font-weight: 300;
  color: #d1d5db;
  position: absolute;
  top: -40px;
  left: -20px;
  z-index: -10;
}

.step3-image {
  margin-top: 144px;
}

.step3-box {
 background-image: url("/thirdcardbg.svg");
 height: 274px;
}

.step3-number {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  font-size: 110px;
  font-weight: 500;
  color: #4b5563;
  line-height: 1;
  font-family: 'Rubik', sans-serif;
}

.action-buttons {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  display: flex;
  gap: 10px;
}

.action-btn {
  background: transparent !important;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}




/* Step Number */
.step-number {
  position: absolute;
}

.no-scrollbar { -ms-overflow-style: none; /* IE and Edge */ scrollbar-width: none; /* Firefox */ }

        .dyad-button {
            position: relative;
            width: 100%;
            max-width:250px;
            height: 45px;
            background: #3B63FB;
            border: none;
            border-radius: 12px;
            color: white;
            margin:auto;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            overflow: hidden;
        }

        .dyad-button:hover {
            background: #2952ea;
            color: white;

            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 99, 251, 0.3);
        }

        .dyad-button:active {
            transform: translateY(0);
            box-shadow: 0 4px 10px rgba(59, 99, 251, 0.2);
        }

        .button-content {
            position: relative;
            z-index: 2;
        }

        /* Star decorations */
        .star {
            position: absolute;
            color: white;
        }

        .star-1 {
            top: 15px;
            right: 18px;
            font-size: 24px;
        }

        .star-2 {
            top: 8px;
            right: 8px;
            font-size: 16px;
        }

        .star-3 {
            bottom: 8px;
            left: 12px;
            font-size: 24px;
        }

        /* Custom star shapes using CSS */
        .css-star {
            position: absolute;
            color: white;
        }

        .css-star::before {
            content: '✦';
            display: inline-block;
        }

        .css-star-1 {
            top: 15px;
            right: 18px;
            font-size: 24px;
        }

        .css-star-2 {
            top: 8px;
            right: 8px;
            font-size: 16px;
        }

        .css-star-3 {
            bottom: 8px;
            left: 12px;
            font-size: 20px;
        }

        /* Alternative using Unicode stars */
        .unicode-star::before {
            content: '✨';
        }

        .unicode-star-alt::before {
            content: '⭐';
        }

        .unicode-star-sparkle::before {
            content: '✦';
        }



.banner-text {
  font-weight: 700;
  color: black;
  font-size: 32px; /* default for smaller screens */
}

@media (min-width: 1024px) {
  .banner-text {
    font-size: 44px; /* larger screens */
  }
}
</style>