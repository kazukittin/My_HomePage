// =====================================================
// ニュースフィード
// =====================================================

async function loadNewsFeed() {
    const container = document.getElementById("news-feed");

    // 複数のRSSソースを試す（Google Newsを優先）
    const rssSources = [
        { url: "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja", name: "Google" },
        { url: "https://www3.nhk.or.jp/rss/news/cat0.xml", name: "NHK" },
        { url: "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml", name: "ITmedia" }
    ];

    for (const source of rssSources) {
        try {
            const rssUrl = encodeURIComponent(source.url);
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            const data = await res.json();

            if (data.status === "ok" && data.items && data.items.length > 0) {
                container.innerHTML = data.items.slice(0, 8).map(item => {
                    const pubDate = new Date(item.pubDate);
                    const timeAgo = getTimeAgo(pubDate);

                    return `
            <div class="news-item">
              <a href="${item.link}" target="_blank">${item.title}</a>
              <div class="news-source">
                <span class="news-category">${source.name}</span>
                <span>${timeAgo}</span>
              </div>
            </div>
          `;
                }).join('');
                return; // 成功したらループを抜ける
            }
        } catch (e) {
            console.log(`${source.name} fetch failed, trying next...`);
        }
    }

    // すべて失敗した場合はダミーニュース
    showDummyNews(container);
}

function showDummyNews(container) {
    const dummyNews = [
        { title: "本日のトップニュース - 最新情報をお届け", category: "国内" },
        { title: "経済市場動向 - 株価・為替の最新情報", category: "経済" },
        { title: "テクノロジー最前線 - 新製品発表", category: "IT" },
        { title: "エンタメ情報 - 話題の映画・音楽", category: "エンタメ" },
        { title: "スポーツニュース - 本日の試合結果", category: "スポーツ" }
    ];

    container.innerHTML = dummyNews.map(item => `
    <div class="news-item">
      <a href="https://news.google.com/" target="_blank">${item.title}</a>
      <div class="news-source">
        <span class="news-category">${item.category}</span>
        <span>デモデータ</span>
      </div>
    </div>
  `).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "たった今";
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    return `${diffDays}日前`;
}

loadNewsFeed();
