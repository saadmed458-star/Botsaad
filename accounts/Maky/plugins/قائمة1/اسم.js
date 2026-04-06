// plugins/المجموعات/اسم.js

const NovaUltra = {
    command: "اسم",
    description: "تغيير اسم المجموعة (للمشرفين فقط)",
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
    
    // الحصول على الاسم الجديد
    const newName = args.join(" ");
    
    if (!newName) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *📝 طــريــقــة الاســتــخــدام:* .╹↵\n\n.╹↵ *▸ .اسم [الاسم الجديد]* .╹↵\n\n.╹↵ *مثال:* .╹↵\n.╹↵ *.اسم مملكة كرولو* .╹↵`
        }, { quoted: msg });
    }
    
    // التحقق من طول الاسم
    if (newName.length > 25) {
        return await sock.sendMessage(chatId, {
            text: `.╹↵ *⚠️ اسـم الـمـجـمـوعـة طـويـل جـداً* .╹↵\n\n.╹↵ *▸ الـحـد الـأقـصـى 25 حـرف* .╹↵`
        }, { quoted: msg });
    }
    
    try {
        // تغيير اسم المجموعة
        await sock.groupUpdateSubject(chatId, newName);
        
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: msg.key }
        });
        
        await sock.sendMessage(chatId, {
            text: `.╹↵ *✅ تـم تـغـيـيـر اسـم الـمـجـمـوعـة* .╹↵\n\n.╹↵ *▸ الاسـم الـجـديـد:* .╹↵\n.╹↵ *${newName}* .╹↵\n\n.╹↵ *🛡️ تـم بـواسـطة:* @${(msg.key.participant || msg.key.remoteJid).split('@')[0]} .╹↵`,
            mentions: [msg.key.participant || msg.key.remoteJid]
        }, { quoted: msg });
        
    } catch (err) {
        console.error("❌ فشل تغيير الاسم:", err);
        
        let errorMsg = `.╹↵ *❌ فـشـل تـغـيـيـر اسـم الـمـجـمـوعـة* .╹↵\n\n`;
        
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