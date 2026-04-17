<template>
UpdateCatalog

{{brand}} <br>
{{windowName}} <br>
{{productType}} <br>
{{productId}} <br>
</template>
<script>
export default {
    name:"UpdateCatalogue",
props: {
  brand: { type: String, default: null },
  windowName: { type: String, default: null },
  productType: { type: String, default: null },
  productId: { type: String, default: null },
},
 computed: {
    queryParams() {
    return {
      brand:       this.brand       ?? this.$route.query?.brand,
      window_name: this.windowName  ?? this.$route.query?.window_name,
      product_type:this.productType ?? this.$route.query?.product_type,
      product_id:  this.productId   ?? this.$route.query?.product_id,
    }
  }
  },
}
</script>