import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: 'large' }
    })
    expect(wrapper.find('.size-large').exists()).toBe(true)
  })

  it('applies custom color', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { color: '#ff0000' }
    })
    const spinner = wrapper.find('.spinner')
    expect(spinner.attributes('style')).toContain('border-top-color: rgb(255, 0, 0)')
  })
})
