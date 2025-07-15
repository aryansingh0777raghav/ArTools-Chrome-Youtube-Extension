// popup.js – Script for ArTools popup

document.addEventListener("DOMContentLoaded", async () => {
    const videoData = await getVideoData();

    if (videoData) {
        updateUIWithMetadata(videoData);
        setupEventListeners(videoData);
    } else {
        document.getElementById("main-content").style.display = "none";
        document.getElementById("error-content").style.display = "block";
    }
});

async function getVideoData() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url;

        if (!url.includes("youtube.com/watch")) return null;

        const videoId = new URL(url).searchParams.get("v");
        const title = tab.title;

        return {
            url,
            videoId,
            title,
            channel: tab.title.split(" - ")[1] || "Unknown",
            views: "(Not available via extension API)",
            uploaded: "(Not available via extension API)"
        };
    } catch (err) {
        console.error("Error fetching video data:", err);
        return null;
    }
}

function updateUIWithMetadata(data) {
    document.getElementById("video-title").textContent = data.title;
    document.getElementById("video-channel").textContent = data.channel;
    document.getElementById("video-views").textContent = data.views;
    document.getElementById("video-date").textContent = data.uploaded;
    document.getElementById("video-id").textContent = data.videoId;
    document.getElementById("thumbnail-preview").src = `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`;
}

function setupEventListeners(data) {
    document.getElementById("download-media-btn")?.addEventListener("click", () => {
        // NOTE: Third-party download sites are unreliable and can stop working.
        const downloadUrl = `https://www.youtubepp.com/watch?v=${data.videoId}`;
        window.open(downloadUrl, "_blank");
    });

    document.getElementById("download-thumb-btn")?.addEventListener("click", () => {
        chrome.downloads.download({
            url: `https://img.youtube.com/vi/${data.videoId}/maxresdefault.jpg`,
            filename: `${data.videoId}-thumbnail.jpg`
        });
    });

    document.getElementById("copy-title-btn")?.addEventListener("click", () => {
        navigator.clipboard.writeText(data.title);
    });

    document.getElementById("copy-link-btn")?.addEventListener("click", () => {
        navigator.clipboard.writeText(data.url);
    });
}
