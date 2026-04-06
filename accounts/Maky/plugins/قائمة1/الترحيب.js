// plugins/قائمة1/الترحيب.js

// تخزين حالة الترحيب لكل مجموعة
const welcomeSettings = new Map();
const welcomedParticipants = new Set();

export const NovaUltra = {
    command: ["ترحيب"],
    description: "تشغيل أو إيقاف الترحيب التلقائي بالأعضاء الجدد",
    category: "الترحيب",
    elite: "off",
    group: true,
    prv: false,
    admin: true
};

// دالة الترحيب (تُستدعى تلقائياً عند دخول عضو جديد)
export async function handleWelcome(sock, update) {
    try {
        const groupId = update.id;
        
        // التأكد أن الترحيب مفعل لهذه المجموعة وأن الإجراء هو إضافة عضو
        const isActive = welcomeSettings.get(groupId);
        if (!isActive || update.action !== 'add') return;

        for (const participant of update.participants) {
            if (welcomedParticipants.has(participant)) continue;

            try {
                // جلب صورة العضو أو المجموعة
                let ppUrl = null;
                try {
                    ppUrl = await sock.profilePictureUrl(participant, 'image');
                } catch {
                    try {
                        ppUrl = await sock.profilePictureUrl(groupId, 'image');
                    } catch {}
                }

                const welcomeMessage = `.╹↵ *🎉 مـرحـبـاً بـك فـي الـمـجـمـوعـة* .╹↵\n\n.╹↵ *👤 الـعـضـو:* @${participant.split('@')[0]} .╹↵\n\n.╹↵ *🌟 نـتـمـنـى لـك وقـتـاً مـمـتـعـاً* .╹↵\n\n.╹↵ *💬 نـنـتـظـر تـفـاعـلـك الـمـمـيـز* .╹↵\n\n.╹↵ *🛡️ 𝑲𝒓𝒐𝒍𝒍𝒐 - 𝑩𝛩𝑻* .╹↵`;

                if (ppUrl) {
                    await sock.sendMessage(groupId, {
                        image: { url: ppUrl },
                        caption: welcomeMessage,
                        mentions: [participant]
                    });
                } else {
                    await sock.sendMessage(groupId, {
                        text: welcomeMessage,
                        mentions: [participant]
                    });
                }

                // منع التكرار خلال دقيقة
                welcomedParticipants.add(participant);
                setTimeout(() => welcomedParticipants.delete(participant), 60000);

            } catch (err) {
                console.error('خطأ في إرسال الترحيب:', err);
            }
        }
    } catch (err) {
        console.error('خطأ في دالة الترحيب:', err);
    }
}

// تنفيذ الأمر (تشغيل/إيقاف)
async function execute({ sock, msg, args }) {
    const chatId = msg.key.remoteJid;
    const status = args[0]?.toLowerCase();

    // التحقق من وجود كلمة تشغيل/ايقاف
    if (status === 'off' || status === 'ايقاف') {
        welcomeSettings.set(chatId, false);
        await sock.sendMessage(chatId, {
            text: `.╹↵ *🔇 تـم إيـقـاف الـتـرحـيـب الـتـلـقـائـي* .╹↵`
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, {
            react: { text: '🔇', key: msg.key }
        });
        
    } else if (status === 'on' || status === 'تشغيل' || !status) {
        welcomeSettings.set(chatId, true);
        await sock.sendMessage(chatId, {
            text: `.╹↵ *🎯 تـم تـشـغـيـل الـتـرحـيـب الـتـلـقـائـي* .╹↵\n\n.╹↵ *✅ سـيـتـم تـرحـيـب الأعـضـاء الـجـدد تـلـقـائـياً* .╹↵\n\n.╹↵ *⚠️ لإيـقـاف الـتـرحـيـب:* .╹↵\n.╹↵ *.ترحيب ايقاف* .╹↵`
        }, { quoted: msg });
        
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: msg.key }
        });
    } else {
        // عرض الحالة الحالية
        const currentState = welcomeSettings.get(chatId) ? '🟢 مـفـعـل' : '🔴 مـعـطـل';
        await sock.sendMessage(chatId, {
            text: `.╹↵ *📊 حـالـة الـتـرحـيـب* .╹↵\n\n.╹↵ *▸ ${currentState}* .╹↵\n\n.╹↵ *📌 لـلـتـشـغـيـل:* .╹↵\n.╹↵ *.ترحيب تشغيل* .╹↵\n\n.╹↵ *📌 لـلـإيـقـاف:* .╹↵\n.╹↵ *.ترحيب ايقاف* .╹↵`
        }, { quoted: msg });
    }
}

export default { NovaUltra, execute, handleWelcome };