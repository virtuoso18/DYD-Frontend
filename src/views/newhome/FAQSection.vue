<template>
  <div class="p-2.5 max-w-full mx-auto">
    <br /><br /><br />
<h1
  class="text-center"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
    color: #000;
  "
>
  Got questions? We have answers
</h1>
    <br />
    <div class="my-12 px-5">
      <a-collapse
        v-model:activeKey="activeKey"
        accordion
        class="bg-white border-none text-lg"
      >
        <a-collapse-panel key="1" header="What is virtual staging?">
          <p class="m-0 text-[15px] leading-relaxed text-gray-600">
            Virtual staging is a process of using computer technology to furnish and decorate real estate photos digitally.
          </p>
        </a-collapse-panel>

        <a-collapse-panel key="2" header="Why should I pick virtual staging over physical staging?">
          <p class="m-0 text-[15px] leading-relaxed text-gray-600">
            Virtual staging offers several advantages over physical staging. It's more cost-effective, as it eliminates the need for furniture rentals and setup. It's also faster, allowing for quicker turnaround times and adjustments to suit different buyer preferences. Additionally, virtual staging is highly flexible, enabling you to create multiple design styles and settings without the physical limitations of a space.
          </p>
        </a-collapse-panel>

        <a-collapse-panel key="3" header="What is AI virtual staging?">
          <p class="m-0 text-[15px] leading-relaxed text-gray-600">
            AI virtual staging uses artificial intelligence models to automatically place furniture and décor in photos, saving time while creating realistic results.
          </p>
        </a-collapse-panel>

        <a-collapse-panel key="4" header="What kind of photos do you support?">
          <p class="m-0 text-[15px] leading-relaxed text-gray-600">
            We support wide-angle interior property photos such as living rooms, bedrooms, dining areas, and more.
          </p>
        </a-collapse-panel>

        <a-collapse-panel key="5" header="How long does it take to virtually stage by AI?">
          <p class="m-0 text-[15px] leading-relaxed text-gray-600">
            AI staging usually takes just a few minutes, depending on the complexity of the design and processing load.
          </p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQSection',
  data() {
    return {
      activeKey: '1'
    }
  }
}
</script>
