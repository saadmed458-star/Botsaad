// plugins/المجموعات/المشرفين.js
import { jidDecode } from "@whiskeysockets/baileys";

const NovaUltra = {
    command: ["المشرفين"],
    description: "عرض قائمة المشرفين في المجموعة",
    elite: "off",
    group: true,
    prv: false,
    lock: "off"
};

function decode(jid) {
    return (jidDecode(jid)?.user || jid.split("@")[0]) + "@s.whatsapp.net";
}

async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    
    // التأكد أن الأمر في مجموعة
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *⚠️ هـذا الأمـر يـعـمـل فـي الـمـجـمـوعـات فـقـط* .╹↵`
        }, { quoted: msg });
    }
    
    await sock.sendMessage(chatId, {
        react: { text: '⏳', key: msg.key }
    });
    
    try {
        // جلب معلومات المجموعة
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        
        // تصنيف المشرفين
        const superAdmins = [];
        const admins = [];
        
        for (const participant of participants) {
            if (participant.admin === 'superadmin') {
                superAdmins.push(participant.id);
            } else if (participant.admin === 'admin') {
                admins.push(participant.id);
            }
        }
        
        // بناء الرسالة
        let message = `.╹↵ *👑 قـائـمـة الـمـشـرفـيـن* .╹↵\n\n`;
        
        if (superAdmins.length > 0) {
            message += `.╹↵ *▸ الـمـؤسـس (المالك):* .╹↵\n`;
            for (const admin of superAdmins) {
                message += `.╹↵ @${admin.split('@')[0]} .╹↵\n`;
            }
            message += `.╹↵ ━━━━━━━━━━━━━━ .╹↵\n`;
        }
        
        if (admins.length > 0) {
            message += `.╹↵ *▸ الـمـشـرفـيـن:* .╹↵\n`;
            for (const admin of admins) {
                message += `.╹↵ @${admin.split('@')[0]} .╹↵\n`;
            }
            message += `.╹↵ ━━━━━━━━━━━━━━ .╹↵\n`;
        }
        
        const totalAdmins = superAdmins.length + admins.length;
        message += `.╹↵ *📊 الـعـدد:* ${totalAdmins} مـشـرف .╹↵\n\n`;
        message += `.╹↵ *⎔═━═━ ╃━╷⚜️╵━╄ ━═━═⎔* .╹↵`;
        message += `.╹↵ > ⏤͟͟͞͞ ~ 𝑲𝒓𝒐𝒍𝒍𝒐 - 𝑩𝛩𝑻 🕸⃝⃕ .╹↵`;
        
        const mentions = [...superAdmins, ...admins];
        
        await sock.sendMessage(chatId, {
            text: message,
            mentions: mentions
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: msg.key }
        });
        
    } catch (error) {
        console.error("❌ خطأ في أمر المشرفين:", error);
        await sock.sendMessage(chatId, {
            react: { text: '❌', key: msg.key }
        });
        await sock.sendMessage(chatId, { 
            text: `.╹↵ *❌ حــدث خــطــأ أثــنــاء جــلــب الــمــشــرفــيــن* .╹↵`
        }, { quoted: msg });
    }
}

export default { NovaUltra, execute };