// plugins/المجموعات/وصف.js

const NovaUltra = {
    command: "وصف",
    description: "تغيير وصف المجموعة (للمشرفين فقط)",
    elite: "off",
    group: true,
    prv: false,
    lock: "off",
    admin: true
};

async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    
    // التأكد أن الأمر في مجموعة
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *⚠️ هـذا الأمـر يـعـمـل فـي الـمـجـمـوعـات فـقـط* .╹↵`
        }, { quoted: msg });
    }
    
    // الحصول على الوصف الجديد
    const newDesc = args.join(" ");
    
    if (!newDesc) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *📝 طــريــقــة الاســتــخــدام:* .╹↵\n\n.╹↵ *▸ .وصف [الوصف الجديد]* .╹↵\n\n.╹↵ *مثال:* .╹↵\n.╹↵ *.وصف مرحباً بكم في مملكة كرولو* .╹↵`
        }, { quoted: msg });
    }
    
    // التحقق من طول الوصف
    if (newDesc.length > 500) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *⚠️ وصـف الـمـجـمـوعـة طـويـل جـداً* .╹↵\n\n.╹↵ *▸ الـحـد الـأقـصـى 500 حـرف* .╹↵`
        }, { quoted: msg });
    }
    
    try {
        // تغيير وصف المجموعة
        await sock.groupUpdateDescription(chatId, newDesc);
        
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: msg.key }
        });
        
        await sock.sendMessage(chatId, {
            text: `.╹↵ *✅ تـم تـغـيـيـر وصـف الـمـجـمـوعـة* .╹↵\n\n.╹↵ *▸ الـوصـف الـجـديـد:* .╹↵\n.╹↵ *${newDesc}* .╹↵\n\n.╹↵ *🛡️ تـم بـواسـطة:* @${(msg.key.participant || msg.key.remoteJid).split('@')[0]} .╹↵`,
            mentions: [msg.key.participant || msg.key.remoteJid]
        }, { quoted: msg });
        
    } catch (err) {
        console.error("❌ فشل تغيير الوصف:", err);
        
        let errorMsg = `.╹↵ *❌ فـشـل تـغـيـيـر وصـف الـمـجـمـوعـة* .╹↵\n\n`;
        
        if (err.message.includes("not-authorized")) {
            errorMsg += `.╹↵ *⚠️ الـبـوت لـيـس مـشـرفـاً* .╹↵\n`;
            errorMsg += `.╹↵ *▸ يـرجـى تـرـقـيـة الـبـوت إلـى مـشـرف* .╹↵`;
        } else {
            errorMsg += `.╹↵ *⚠️ حـدث خـطـأ غـيـر مـتـوقـع* .╹↵\n`;
            errorMsg += `.╹↵ *▸ ${err.message}* .╹↵`;
        }
        
        await sock.sendMessage(chatId, {
            text: errorMsg
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, {
            react: { text: '❌', key: msg.key }
        });
    }
}

export default { NovaUltra, execute };