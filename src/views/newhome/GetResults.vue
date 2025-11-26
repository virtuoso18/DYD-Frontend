<template>
   <br>
    
   <div className="hidden lg:block">
    <div class="header">
      <h3
  class="text-center pt-12 text-black"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-style: normal;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
  "
>
  {{ mainTitle }}
</h3>

<p
  class="header-text py-4"
  :style="{
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '-2%',
    textAlign: 'center'
  }"
>
  {{ subText1 }}
</p>
<p
  class="header-text"
  :style="{
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '-2%',
    textAlign: 'center'
  }"
>
  {{ subText2 }}
</p>
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
    <!-- <div class="text-center mb-16">
      <h1 class="!font-proza-libre font-black text-3xl sm:text-4xl lg:text-5xl text-black mb-5">
        Get listing-ready results in seconds
      </h1>
      <p class="!font-poppins text-base text-gray-500 leading-relaxed">
        Turn your property photos into stunning visuals in three simple
      </p>
      <p class="font-poppins text-base text-gray-500 leading-relaxed">
        steps to attract buyers and enhance your listings.
      </p>
    </div> -->

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
</template>

<script>
export default {
  name: 'GetResults',

  props: {
    mainTitle: {
      type: String,
      default: 'Get listing-ready results in seconds'
    },
    subText1: {
      type: String,
      default: 'Turn your property photos into stunning visuals in three simple'
    },
    subText2: {
      type: String,
      default: 'steps to attract buyers and enhance your listings.'
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
