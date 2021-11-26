import { useTitle } from '@/hooks/useTitle';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      useTitle()
    })
    return () => (
      <router-view />
    )
  }
})
