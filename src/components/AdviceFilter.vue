<template>
  <section class="card filter-card">
    <div class="flex">
      <h2>建议筛选</h2>
      <span class="badge">可选</span>
    </div>
    <div class="options">
      <label v-for="item in items" :key="item.value" class="option">
        <input
          type="checkbox"
          :checked="modelValue.includes(item.value)"
          @change="toggle(item.value)"
        />
        <span>{{ item.label }}</span>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
export type AdviceFilterKey = "wear" | "travel" | "activity" | "items" | "tips";

const props = defineProps<{ modelValue: AdviceFilterKey[] }>();
const emit = defineEmits<{ "update:modelValue": [value: AdviceFilterKey[]] }>();

const items = [
  { value: "wear", label: "穿搭" },
  { value: "travel", label: "出行" },
  { value: "activity", label: "活动" },
  { value: "items", label: "物品" },
  { value: "tips", label: "小提示" }
] as const;

const toggle = (value: AdviceFilterKey) => {
  const exists = props.modelValue.includes(value);
  const next = exists
    ? props.modelValue.filter((item) => item !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next.length ? next : props.modelValue);
};
</script>

<style scoped>
.filter-card {
  padding: 16px 20px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
}

.option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
}

input[type="checkbox"] {
  accent-color: var(--accent);
}
</style>
