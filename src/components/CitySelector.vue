<template>
  <div class="selector">
    <label class="label">搜索城市</label>
    <div class="row">
      <input
        class="input"
        :value="modelValue"
        @input="onInput"
        @keyup.enter="onSearch"
        placeholder="输入城市名或城市编码"
      />
      <button class="btn" @click="onSearch">查询</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string]; search: [] }>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const onSearch = () => {
  emit("search");
};
</script>

<style scoped>
.selector {
  display: grid;
  gap: 6px;
  min-width: 220px;
}

.label {
  font-size: 12px;
  color: #64748b;
}

.input {
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn {
  background: rgba(14, 165, 233, 0.12);
  color: #0f172a;
  border: 1px solid rgba(14, 165, 233, 0.35);
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}
</style>
