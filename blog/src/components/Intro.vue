<template>
  <div class="chatgpt-home">
    <div class="hero-section">
      <h1>BlueBuffer</h1>
      <p>寻找你的星球 |  | 分享你的故事</p>
      <p>更懂你的网络社区，让优质的信息能够更广泛地传播</p>
      <button @click="goToLogin">Get Started</button>
    </div>

    <div class="features-section">
      <div class="feature-item">
        <h2>Writes, brainstorms, edits, and explores ideas with you</h2>
        <p>Summarize meetings. Find new insights. Increase productivity.</p>
      </div>
      <div class="feature-item">
        <h2>Generate and debug code. Automate repetitive tasks. Learn new APIs.</h2>
        <p>Learn something new. Dive into a hobby. Answer complex questions.</p>
      </div>
      <div class="feature-item">
        <h2>Explore more features in ChatGPT</h2>
        <p>Type, talk, and use it your way</p>
      </div>
    </div>

    <div class="additional-features">
      <div class="feature-item">
        <h2>Search the web</h2>
        <p>Click the web search icon to get fast, timely answers with links to relevant web sources.</p>
      </div>
      <div class="feature-item">
        <h2>Collaborate on writing and code</h2>
        <p>With canvas, you can work with ChatGPT on projects that require editing and revisions.</p>
      </div>
      <div class="feature-item">
        <h2>Analyze data and create charts</h2>
        <p>Upload a file and ask ChatGPT to help analyze data, summarize information or create a chart.</p>
      </div>
      <div class="feature-item">
        <h2>Talk about an image</h2>
        <p>Take or upload an image and ask ChatGPT about it.</p>
      </div>
      <div class="feature-item">
        <h2>Tackle hard problems with deep reasoning</h2>
        <p>OpenAI o1 is trained to spend more time thinking before responding and reasons through complex questions across fields like math, science, and coding.</p>
      </div>
      <div class="feature-item">
        <h2>Create images</h2>
        <p>Ask ChatGPT to create images using a simple sentence or detailed paragraph.</p>
      </div>
      <div class="feature-item">
        <h2>Apple & ChatGPT</h2>
        <p>At WWDC in June 2024, we announced a partnership with Apple to integrate ChatGPT into experiences within iOS, iPadOS, and macOS.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToLogin() {
      this.$router.push('/login'); // 跳转到登录页面
    }
  }
};
</script>

<style scoped>
.chatgpt-home {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #e0f7fa; /* 浅蓝色背景 */
  color: #37474f; /* 深灰色文字 */
}

.hero-section {
  background-color: #ffffff; /* 白色背景 */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #007bff; /* 蓝色标题 */
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #37474f; /* 深灰色文字 */
}

.hero-section button {
  padding: 10px 20px;
  background-color: #007bff; /* 蓝色按钮 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.hero-section button:hover {
  background-color: #0056b3; /* 按钮悬停时的深蓝色 */
}

.features-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-item {
  background-color: #ffffff; /* 白色背景 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  width: calc(33.333% - 20px);
  border: 1px solid #007bff; /* 蓝色边框 */
}

.feature-item h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #007bff; /* 蓝色标题 */
}

.feature-item p {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #37474f; /* 深灰色文字 */
}

.additional-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.additional-features .feature-item {
  background-color: #ffffff; /* 白色背景 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  width: calc(50% - 20px);
  border: 1px solid #007bff; /* 蓝色边框 */
}
</style>