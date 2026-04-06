// plugins/الادوات/ترجمة.js
import axios from 'axios';

const NovaUltra = {
    command: ["ترجم"],
    description: "ترجمة النصوص إلى العربية",
    elite: "off",
    group: true,
    prv: true,
    lock: "off"
};

async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    const text = args.join(" ");
    
    if (!text) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *📝 .ترجم [النص]* .╹↵\n\n.╹↵ *مثال:* .ترجم Hello .╹↵`
        }, { quoted: msg });
    }
    
    await sock.sendMessage(chatId, { react: { text: '⏳', key: msg.key } });
    
    // معرف القناة (ضع JID قناتك هنا)
    const channelJid = "120363333333333333@newsletter";
    const channelName = "𝑲𝒓𝒐𝒍𝒍𝒐 𝑩𝒐𝒕";
    
    try {
        // ترجمة باستخدام Google Translate API
        const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${encodeURIComponent(text)}`);
        const translated = response.data[0][0][0];
        
        const result = `.╹↵ *🌐 نـتـيـجـة الـتـرجـمـة* .╹↵\n\n.╹↵ *📝 الـنـص:* .╹↵\n.╹↵ ${text} .╹↵\n\n.╹↵ *🔤 الـتـرجـمـة:* .╹↵\n.╹↵ ${translated} .╹↵\n\n.╹↵ *⎔═━═━ ╃━╷⚜️╵━╄ ━═━═⎔* .╹↵\n.╹↵ > ⏤͟͟͞͞ ~ 𝑲𝒓𝒐𝒍𝒍𝒐 - 𝑩𝛩𝑻 🕸⃝⃕ .╹↵`;
        
        await sock.sendMessage(chatId, {
            text: result,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: channelName,
                    serverMessageId: Date.now().toString()
                }
            }
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, { react: { text: '✅', key: msg.key } });
        
    } catch (err) {
        console.error("❌ خطأ في الترجمة:", err);
        await sock.sendMessage(chatId, { 
            text: `.╹↵ *❌ فـشـل الـتـرجـمـة* .╹↵\n\n.╹↵ *⚠️ حـاول مـرة أخـرى* .╹↵`
        }, { quoted: msg });
        await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
    }
}

export default { NovaUltra, execute };