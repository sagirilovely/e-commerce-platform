<template>
  <a-upload
    name="img"
    :multiple="false"
    list-type="picture-card"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :customRequest="customRequest"
  >
    <div class="upload-container">
      <div v-if="loading" class="loading-overlay">
        <a-spin :spinning="loading">
          <div class="spin-content"></div>
        </a-spin>
      </div>
      <div>
        <plus-outlined />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </div>
  </a-upload>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import netPackage from '@/util/netPackage.ts'
interface Props {
  category: 'img_url' | 'html_introduce';
  onSuccess?: (data: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onSuccess: () => {}
});

const loading = ref(false);

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件!');
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!');
    return false;
  }
  return true;
};
interface ApiResponse {
  data: string;
  message?: string;
}
interface CustomRequestArgs {
  file: File;
  onProgress?: (event: { percent: number }) => void;
  onSuccess?: (response:ApiResponse) => void;
  onError?: (error: Error) => void;
}

const customRequest = async ({ file }: CustomRequestArgs) => {
  const formData = new FormData();
  formData.append('img', file);
  formData.append('category', props.category);

  try {
    loading.value = true;
    const response = await fetch(netPackage.originUrl+'/merchant/img/convert', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();
    if (response.status === 200) {
      message.success('上传成功');
      props.onSuccess(result.data);
    } else {
      message.error(result.message || '上传失败');
    }
  } catch (error) {
    message.error('请求失败，请检查网络连接');
    console.error('Upload error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.spin-content {
  width: 40px;
  height: 40px;
}
</style>
