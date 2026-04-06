// plugins/المجموعات/منشن.js
import { jidDecode } from "@whiskeysockets/baileys";

const NovaUltra = {
    command: ["منشن"],
    description: "منشن جميع أعضاء المجموعة (للمشرفين فقط)",
    elite: "off",
    group: true,
    prv: false,
    lock: "off",
    admin: true
};

function decode(jid) {
    return (jidDecode(jid)?.user || jid.split("@")[0]) + "@s.whatsapp.net";
}

async function isGroupAdmin(sock, chatId, userId) {
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const participant = groupMetadata.participants.find(p => p.id === userId);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
        return false;
    }
}

async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    const sender = decode(msg.key.participant || chatId);
    
    // التأكد أن الأمر في مجموعة
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *⚠️ هـذا الأمـر يـعـمـل فـي الـمـجـمـوعـات فـقـط* .╹↵`
        }, { quoted: msg });
    }
    
    try {
        // التحقق من أن المرسل مشرف
        const isAdmin = await isGroupAdmin(sock, chatId, sender);
        
        if (!isAdmin && !msg.key.fromMe) {
            await sock.sendMessage(chatId, {
                react: { text: '⚠️', key: msg.key }
            });
            return await sock.sendMessage(chatId, {
                text: `.╹↵ *🛡️ هـذا الأمـر لـلـمـشـرفـيـن فـقـط* .╹↵`
            }, { quoted: msg });
        }
        
        await sock.sendMessage(chatId, {
            react: { text: '⏳', key: msg.key }
        });
        
        // جلب معلومات المجموعة
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        
        // النص الإضافي (اختياري)
        const extraMsg = args.length > 0 ? args.join(" ") : "";
        
        // بناء رسالة المنشن
        let tagMessage = `.╹↵ *🔔 تــنــبــيــه عــام* .╹↵\n\n`;
        
        if (extraMsg) {
            tagMessage += `.╹↵ *📝 الــرســالــة:* .╹↵\n`;
            tagMessage += `.╹↵ ${extraMsg} .╹↵\n\n`;
        }
        
        tagMessage += `.╹↵ *👥 الأعــضــاء:* .╹↵\n`;
        tagMessage += `.╹↵ ━━━━━━━━━━━━━━ .╹↵\n`;
        
        // إضافة المنشنات (تجميعهم في سطور)
        const chunkSize = 10;
        for (let i = 0; i < participants.length; i += chunkSize) {
            const chunk = participants.slice(i, i + chunkSize);
            let line = `.╹↵ `;
            for (const p of chunk) {
                line += `@${p.id.split('@')[0]} `;
            }
            tagMessage += line + `.╹↵\n`;
        }
        
        tagMessage += `.╹↵ ━━━━━━━━━━━━━━ .╹↵\n`;
        tagMessage += `.╹↵ *📊 الــعــدد:* ${participants.length} عــضــو .╹↵\n\n`;
        tagMessage += `.╹↵ *🛡️ تــم الــتــنــبــيــه بــواســطــة:* @${sender.split('@')[0]} .╹↵\n\n`;
        tagMessage += `.╹↵ *⎔═━═━ ╃━╷⚜️╵━╄ ━═━═⎔* .╹↵`;
        tagMessage += `.╹↵ > ⏤͟͟͞͞ ~ 𝑲𝒓𝒐𝒍𝒍𝒐 - 𝑩𝛩𝑻 🕸⃝⃕ .╹↵`;
        
        // معرف القناة (ضع هنا JID قناتك)
        const channelJid = "120363333333333333@newsletter"; // ⚠️ غير هذا إلى JID قناتك الحقيقي
        const channelName = "𝑲𝒓𝒐𝒍𝒍𝒐 𝑩𝒐𝒕";
        
        // إضافة إعادة توجيه من القناة
        const contextInfoWithChannel = {
            mentionedJid: participants.map(p => p.id),
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelJid,
                newsletterName: channelName,
                serverMessageId: Date.now().toString()
            }
        };
        
        // إرسال الرسالة مع المنشنات وإعادة التوجيه
        await sock.sendMessage(chatId, {
            text: tagMessage,
            mentions: participants.map(p => p.id),
            contextInfo: contextInfoWithChannel
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: msg.key }
        });
        
    } catch (error) {
        console.error("❌ خطأ في أمر منشن:", error);
        await sock.sendMessage(chatId, {
            react: { text: '❌', key: msg.key }
        });
        await sock.sendMessage(chatId, { 
            text: `.╹↵ *❌ حــدث خــطــأ أثــنــاء مــنــشــن الأعــضــاء* .╹↵`
        }, { quoted: msg });
    }
}

export default { NovaUltra, execute };