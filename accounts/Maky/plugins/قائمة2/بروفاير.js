// plugins/الادوات/بروفايل.js
import { jidDecode } from '@whiskeysockets/baileys';

const NovaUltra = {
    command: ["بروفايل"],
    description: "عرض صورة الملف الشخصي للشخص المراد عليه",
    elite: "off",
    group: true,
    prv: true,
    lock: "off"
};

async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    
    // معرف القناة (ضع JID قناتك هنا)
    const channelJid = "120363333333333333@newsletter";
    const channelName = "𝑲𝒓𝒐𝒍𝒍𝒐 𝑩𝒐𝒕";
    
    // الحصول على الشخص المطلوب (الرد على رسالة أو منشن)
    const quoted = msg.message?.extendedTextMessage?.contextInfo;
    let targetJid = quoted?.participant;
    
    // إذا لم يكن هناك رد، نبحث عن منشن
    if (!targetJid) {
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentionedJids && mentionedJids.length > 0) {
            targetJid = mentionedJids[0];
        }
    }
    
    // إذا لم يكن هناك رد ولا منشن، نستخدم المرسل نفسه
    if (!targetJid) {
        targetJid = msg.key.participant || msg.key.remoteJid;
    }
    
    await sock.sendMessage(chatId, { react: { text: '⏳', key: msg.key } });
    
    try {
        // جلب صورة البروفايل
        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(targetJid, 'image');
        } catch {
            return await sock.sendMessage(chatId, {
                text: `.╹↵ *❌ لا تــوجــد صــورة لــلــشــخــص* .╹↵\n\n.╹↵ *⚠️ أو لا يــســمــح بــالــوصــول* .╹↵`
            }, { quoted: msg });
        }
        
        const targetNumber = targetJid.split('@')[0];
        
        const caption = `.╹↵ *🖼️ بـروفـايـل الـشـخـص* .╹↵\n\n.╹↵ *👤 @${targetNumber}* .╹↵\n\n.╹↵ *⎔═━═━ ╃━╷⚜️╵━╄ ━═━═⎔* .╹↵\n.╹↵ > ⏤͟͟͞͞ ~ 𝑲𝒓𝒐𝒍𝒍𝒐 - 𝑩𝛩𝑻 🕸⃝⃕ .╹↵`;
        
        await sock.sendMessage(chatId, {
            image: { url: ppUrl },
            caption: caption,
            mentions: [targetJid],
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
        console.error("❌ خطأ:", err);
        await sock.sendMessage(chatId, {
            text: `.╹↵ *❌ حــدث خــطــأ أثــنــاء جــلــب الــصــورة* .╹↵`
        }, { quoted: msg });
        await sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
    }
}

export default { NovaUltra, execute };