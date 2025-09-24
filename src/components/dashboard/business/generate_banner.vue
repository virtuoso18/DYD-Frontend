<template>
<div style="background: white; margin-top: 10px; padding: 20px; border: 2px solid rgba(0,0,0,0.1); border-radius: 20px; overflow-y: auto;">
    <h2 style="margin-bottom: 30px; color: #262626; font-weight: 600;">Generate a Banner</h2>
    
    <!-- First Row - Square Banner (1080px) -->
    <div style="margin-bottom: 40px;">
        <a-row :gutter="[20, 20]" align="middle">
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; border-radius: 20px; background-color: rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s ease; border: 2px dashed rgba(0,0,0,0.15);" 
                     @click="handleUpload" 
                     @mouseover="handleHover" 
                     @mouseleave="handleLeave">
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.75 65.1639C25.1844 69.5798 26.166 72.5521 28.3846 74.7705C32.3639 78.75 38.7684 78.75 51.5775 78.75C64.3867 78.75 70.7914 78.75 74.7705 74.7705C78.75 70.7914 78.75 64.3867 78.75 51.5775C78.75 38.7684 78.75 32.3639 74.7705 28.3846C72.5521 26.166 69.5798 25.1844 65.1639 24.75" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M11.25 38.25C11.25 25.5221 11.25 19.1581 15.204 15.204C19.1581 11.25 25.5221 11.25 38.25 11.25C50.9778 11.25 57.342 11.25 61.2958 15.204C65.25 19.1581 65.25 25.5221 65.25 38.25C65.25 50.9778 65.25 57.342 61.2958 61.2958C57.342 65.25 50.9778 65.25 38.25 65.25C25.5221 65.25 19.1581 65.25 15.204 61.2958C11.25 57.342 11.25 50.9778 11.25 38.25Z" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M21.375 65.2499C32.9196 49.2142 45.8934 27.9477 65.25 43.8976" stroke="#B3B3B3" stroke-width="1.5"/>
                    </svg>
                </div>
                <p style="margin-top: 10px; color: #8c8c8c; font-size: 12px; text-align: center;">Click to upload image</p>
            </a-col>
            
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="padding-left: 20px;">
                    <div style="padding: 12px 16px; border-radius: 12px; background-color: rgba(0,0,0,0.06); margin-bottom: 20px; display: inline-block; font-weight: 500; color: #434343;">
                        1080px × 1080px
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 6px; color: #3B63FB; font-weight: 500; font-size: 14px;">
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.91797C4.58722 1.91797 1.41602 5.08918 1.41602 9.0013C1.41602 12.9134 4.58722 16.0846 8.49935 16.0846C12.4115 16.0846 15.5827 12.9134 15.5827 9.0013C15.5827 5.08918 12.4115 1.91797 8.49935 1.91797ZM8.49935 2.6263C8.49935 4.31706 7.8277 5.93856 6.63215 7.13411C5.43661 8.32965 3.8151 9.0013 2.12435 9.0013C3.8151 9.0013 5.43661 9.67295 6.63215 10.8685C7.8277 12.064 8.49935 13.6855 8.49935 15.3763C8.49935 13.6855 9.171 12.064 10.3665 10.8685C11.5621 9.67295 13.1836 9.0013 14.8743 9.0013C13.1836 9.0013 11.5621 8.32965 10.3665 7.13411C9.171 5.93856 8.49935 4.31706 8.49935 2.6263Z" fill="#3B63FB"/>
                            </svg>
                            10 Credits
                        </div>
                        
                        <a-button type="primary" size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 24px;" @click="handleGenerate">
                            Generate
                        </a-button>
                        
                        <a-button size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 16px; display: flex; align-items: center; gap: 8px;" @click="handleDownload">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33268 11.332C3.50949 11.332 3.67906 11.4023 3.80409 11.5273C3.92911 11.6523 3.99935 11.8219 3.99935 11.9987V13.332H11.9993V11.9987C11.9993 11.8219 12.0696 11.6523 12.1946 11.5273C12.3196 11.4023 12.4892 11.332 12.666 11.332C12.8428 11.332 13.0124 11.4023 13.1374 11.5273C13.2624 11.6523 13.3327 11.8219 13.3327 11.9987V13.332C13.3327 13.6857 13.1922 14.0248 12.9422 14.2748C12.6921 14.5249 12.353 14.6654 11.9993 14.6654H3.99935C3.64573 14.6654 3.30659 14.5249 3.05654 14.2748C2.80649 14.0248 2.66602 13.6857 2.66602 13.332V11.9987C2.66602 11.8219 2.73625 11.6523 2.86128 11.5273C2.9863 11.4023 3.15587 11.332 3.33268 11.332Z" fill="#3B63FB"/>
                                <path d="M8.47041 11.1368C8.34539 11.2618 8.17585 11.332 7.99908 11.332C7.8223 11.332 7.65276 11.2618 7.52775 11.1368L4.86108 8.47017C4.73964 8.34444 4.67244 8.17604 4.67396 8.00124C4.67548 7.82644 4.74559 7.65923 4.8692 7.53563C4.9928 7.41202 5.16001 7.34191 5.33481 7.34039C5.50961 7.33887 5.67801 7.40607 5.80375 7.52751L7.33241 9.05617L7.33241 1.99884C7.33241 1.82203 7.40265 1.65246 7.52767 1.52743C7.6527 1.40241 7.82227 1.33217 7.99908 1.33217C8.17589 1.33217 8.34546 1.40241 8.47048 1.52744C8.59551 1.65246 8.66575 1.82203 8.66575 1.99884L8.66574 9.05617L10.1944 7.52751C10.3201 7.40607 10.4885 7.33887 10.6633 7.34039C10.8381 7.34191 11.0054 7.41202 11.129 7.53563C11.2526 7.65923 11.3227 7.82644 11.3242 8.00124C11.3257 8.17604 11.2585 8.34444 11.1371 8.47017L8.47041 11.1368Z" fill="#3B63FB"/>
                            </svg>
                            Download
                        </a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>

    <!-- Second Row - Wide Banner (1920px) -->
    <div style="margin-bottom: 40px;">
        <a-row :gutter="[20, 20]" align="middle">
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="width: 100%; max-width: 400px; height: 200px; display: flex; justify-content: center; align-items: center; border-radius: 20px; background-color: rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s ease; border: 2px dashed rgba(0,0,0,0.15);" 
                     @click="handleUpload" 
                     @mouseover="handleHover" 
                     @mouseleave="handleLeave">
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.75 65.1639C25.1844 69.5798 26.166 72.5521 28.3846 74.7705C32.3639 78.75 38.7684 78.75 51.5775 78.75C64.3867 78.75 70.7914 78.75 74.7705 74.7705C78.75 70.7914 78.75 64.3867 78.75 51.5775C78.75 38.7684 78.75 32.3639 74.7705 28.3846C72.5521 26.166 69.5798 25.1844 65.1639 24.75" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M11.25 38.25C11.25 25.5221 11.25 19.1581 15.204 15.204C19.1581 11.25 25.5221 11.25 38.25 11.25C50.9778 11.25 57.342 11.25 61.2958 15.204C65.25 19.1581 65.25 25.5221 65.25 38.25C65.25 50.9778 65.25 57.342 61.2958 61.2958C57.342 65.25 50.9778 65.25 38.25 65.25C25.5221 65.25 19.1581 65.25 15.204 61.2958C11.25 57.342 11.25 50.9778 11.25 38.25Z" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M21.375 65.2499C32.9196 49.2142 45.8934 27.9477 65.25 43.8976" stroke="#B3B3B3" stroke-width="1.5"/>
                    </svg>
                </div>
                <p style="margin-top: 10px; color: #8c8c8c; font-size: 12px; text-align: center;">Click to upload image</p>
            </a-col>
            
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="padding-left: 20px;">
                    <div style="padding: 12px 16px; border-radius: 12px; background-color: rgba(0,0,0,0.06); margin-bottom: 20px; display: inline-block; font-weight: 500; color: #434343;">
                        1920px × 1080px
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 6px; color: #3B63FB; font-weight: 500; font-size: 14px;">
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.91797C4.58722 1.91797 1.41602 5.08918 1.41602 9.0013C1.41602 12.9134 4.58722 16.0846 8.49935 16.0846C12.4115 16.0846 15.5827 12.9134 15.5827 9.0013C15.5827 5.08918 12.4115 1.91797 8.49935 1.91797ZM8.49935 2.6263C8.49935 4.31706 7.8277 5.93856 6.63215 7.13411C5.43661 8.32965 3.8151 9.0013 2.12435 9.0013C3.8151 9.0013 5.43661 9.67295 6.63215 10.8685C7.8277 12.064 8.49935 13.6855 8.49935 15.3763C8.49935 13.6855 9.171 12.064 10.3665 10.8685C11.5621 9.67295 13.1836 9.0013 14.8743 9.0013C13.1836 9.0013 11.5621 8.32965 10.3665 7.13411C9.171 5.93856 8.49935 4.31706 8.49935 2.6263Z" fill="#3B63FB"/>
                            </svg>
                            10 Credits
                        </div>
                        
                        <a-button type="primary" size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 24px;" @click="handleGenerate">
                            Generate
                        </a-button>
                        
                        <a-button size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 16px; display: flex; align-items: center; gap: 8px;" @click="handleDownload">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33268 11.332C3.50949 11.332 3.67906 11.4023 3.80409 11.5273C3.92911 11.6523 3.99935 11.8219 3.99935 11.9987V13.332H11.9993V11.9987C11.9993 11.8219 12.0696 11.6523 12.1946 11.5273C12.3196 11.4023 12.4892 11.332 12.666 11.332C12.8428 11.332 13.0124 11.4023 13.1374 11.5273C13.2624 11.6523 13.3327 11.8219 13.3327 11.9987V13.332C13.3327 13.6857 13.1922 14.0248 12.9422 14.2748C12.6921 14.5249 12.353 14.6654 11.9993 14.6654H3.99935C3.64573 14.6654 3.30659 14.5249 3.05654 14.2748C2.80649 14.0248 2.66602 13.6857 2.66602 13.332V11.9987C2.66602 11.8219 2.73625 11.6523 2.86128 11.5273C2.9863 11.4023 3.15587 11.332 3.33268 11.332Z" fill="#3B63FB"/>
                                <path d="M8.47041 11.1368C8.34539 11.2618 8.17585 11.332 7.99908 11.332C7.8223 11.332 7.65276 11.2618 7.52775 11.1368L4.86108 8.47017C4.73964 8.34444 4.67244 8.17604 4.67396 8.00124C4.67548 7.82644 4.74559 7.65923 4.8692 7.53563C4.9928 7.41202 5.16001 7.34191 5.33481 7.34039C5.50961 7.33887 5.67801 7.40607 5.80375 7.52751L7.33241 9.05617L7.33241 1.99884C7.33241 1.82203 7.40265 1.65246 7.52767 1.52743C7.6527 1.40241 7.82227 1.33217 7.99908 1.33217C8.17589 1.33217 8.34546 1.40241 8.47048 1.52744C8.59551 1.65246 8.66575 1.82203 8.66575 1.99884L8.66574 9.05617L10.1944 7.52751C10.3201 7.40607 10.4885 7.33887 10.6633 7.34039C10.8381 7.34191 11.0054 7.41202 11.129 7.53563C11.2526 7.65923 11.3227 7.82644 11.3242 8.00124C11.3257 8.17604 11.2585 8.34444 11.1371 8.47017L8.47041 11.1368Z" fill="#3B63FB"/>
                            </svg>
                            Download
                        </a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>

    <!-- Third Row - Vertical Banner (1080px) -->
    <div style="margin-bottom: 20px;">
        <a-row :gutter="[20, 20]" align="middle">
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="width: 200px; height: 300px; display: flex; justify-content: center; align-items: center; border-radius: 20px; background-color: rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s ease; border: 2px dashed rgba(0,0,0,0.15);" 
                     @click="handleUpload" 
                     @mouseover="handleHover" 
                     @mouseleave="handleLeave">
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.75 65.1639C25.1844 69.5798 26.166 72.5521 28.3846 74.7705C32.3639 78.75 38.7684 78.75 51.5775 78.75C64.3867 78.75 70.7914 78.75 74.7705 74.7705C78.75 70.7914 78.75 64.3867 78.75 51.5775C78.75 38.7684 78.75 32.3639 74.7705 28.3846C72.5521 26.166 69.5798 25.1844 65.1639 24.75" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M11.25 38.25C11.25 25.5221 11.25 19.1581 15.204 15.204C19.1581 11.25 25.5221 11.25 38.25 11.25C50.9778 11.25 57.342 11.25 61.2958 15.204C65.25 19.1581 65.25 25.5221 65.25 38.25C65.25 50.9778 65.25 57.342 61.2958 61.2958C57.342 65.25 50.9778 65.25 38.25 65.25C25.5221 65.25 19.1581 65.25 15.204 61.2958C11.25 57.342 11.25 50.9778 11.25 38.25Z" stroke="#B3B3B3" stroke-width="1.5"/>
                        <path d="M21.375 65.2499C32.9196 49.2142 45.8934 27.9477 65.25 43.8976" stroke="#B3B3B3" stroke-width="1.5"/>
                    </svg>
                </div>
                <p style="margin-top: 10px; color: #8c8c8c; font-size: 12px; text-align: center;">Click to upload image</p>
            </a-col>
            
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                <div style="padding-left: 20px;">
                    <div style="padding: 12px 16px; border-radius: 12px; background-color: rgba(0,0,0,0.06); margin-bottom: 20px; display: inline-block; font-weight: 500; color: #434343;">
                        1080px × 1920px
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 6px; color: #3B63FB; font-weight: 500; font-size: 14px;">
                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49935 1.91797C4.58722 1.91797 1.41602 5.08918 1.41602 9.0013C1.41602 12.9134 4.58722 16.0846 8.49935 16.0846C12.4115 16.0846 15.5827 12.9134 15.5827 9.0013C15.5827 5.08918 12.4115 1.91797 8.49935 1.91797ZM8.49935 2.6263C8.49935 4.31706 7.8277 5.93856 6.63215 7.13411C5.43661 8.32965 3.8151 9.0013 2.12435 9.0013C3.8151 9.0013 5.43661 9.67295 6.63215 10.8685C7.8277 12.064 8.49935 13.6855 8.49935 15.3763C8.49935 13.6855 9.171 12.064 10.3665 10.8685C11.5621 9.67295 13.1836 9.0013 14.8743 9.0013C13.1836 9.0013 11.5621 8.32965 10.3665 7.13411C9.171 5.93856 8.49935 4.31706 8.49935 2.6263Z" fill="#3B63FB"/>
                            </svg>
                            10 Credits
                        </div>
                        
                        <a-button type="primary" size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 24px;" @click="handleGenerate">
                            Generate
                        </a-button>
                        
                        <a-button size="large" style="border-radius: 8px; font-weight: 500; height: 40px; padding: 0 16px; display: flex; align-items: center; gap: 8px;" @click="handleDownload">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33268 11.332C3.50949 11.332 3.67906 11.4023 3.80409 11.5273C3.92911 11.6523 3.99935 11.8219 3.99935 11.9987V13.332H11.9993V11.9987C11.9993 11.8219 12.0696 11.6523 12.1946 11.5273C12.3196 11.4023 12.4892 11.332 12.666 11.332C12.8428 11.332 13.0124 11.4023 13.1374 11.5273C13.2624 11.6523 13.3327 11.8219 13.3327 11.9987V13.332C13.3327 13.6857 13.1922 14.0248 12.9422 14.2748C12.6921 14.5249 12.353 14.6654 11.9993 14.6654H3.99935C3.64573 14.6654 3.30659 14.5249 3.05654 14.2748C2.80649 14.0248 2.66602 13.6857 2.66602 13.332V11.9987C2.66602 11.8219 2.73625 11.6523 2.86128 11.5273C2.9863 11.4023 3.15587 11.332 3.33268 11.332Z" fill="#3B63FB"/>
                                <path d="M8.47041 11.1368C8.34539 11.2618 8.17585 11.332 7.99908 11.332C7.8223 11.332 7.65276 11.2618 7.52775 11.1368L4.86108 8.47017C4.73964 8.34444 4.67244 8.17604 4.67396 8.00124C4.67548 7.82644 4.74559 7.65923 4.8692 7.53563C4.9928 7.41202 5.16001 7.34191 5.33481 7.34039C5.50961 7.33887 5.67801 7.40607 5.80375 7.52751L7.33241 9.05617L7.33241 1.99884C7.33241 1.82203 7.40265 1.65246 7.52767 1.52743C7.6527 1.40241 7.82227 1.33217 7.99908 1.33217C8.17589 1.33217 8.34546 1.40241 8.47048 1.52744C8.59551 1.65246 8.66575 1.82203 8.66575 1.99884L8.66574 9.05617L10.1944 7.52751C10.3201 7.40607 10.4885 7.33887 10.6633 7.34039C10.8381 7.34191 11.0054 7.41202 11.129 7.53563C11.2526 7.65923 11.3227 7.82644 11.3242 8.00124C11.3257 8.17604 11.2585 8.34444 11.1371 8.47017L8.47041 11.1368Z" fill="#3B63FB"/>
                            </svg>
                            Download
                        </a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</div>
</template>

<script>
export default {
    name: 'generate_banner',
    data() {
        return {
            // Add reactive data here
        }
    },
    methods: {
        handleUpload() {
            console.log('Upload clicked');
            // Add upload logic here
        },
        handleGenerate() {
            console.log('Generate clicked');
            // Add generation logic here
        },
        handleDownload() {
            console.log('Download clicked');
            // Add download logic here
        },
        handleHover(event) {
            event.target.style.backgroundColor = 'rgba(0,0,0,0.12)';
            event.target.style.borderColor = 'rgba(59, 99, 251, 0.3)';
        },
        handleLeave(event) {
            event.target.style.backgroundColor = 'rgba(0,0,0,0.08)';
            event.target.style.borderColor = 'rgba(0,0,0,0.15)';
        }
    }
}
</script>