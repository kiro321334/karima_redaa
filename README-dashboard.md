# لوحة تحكم كريمة: خطوات التركيب

## 1) انسخ الملفات
فك الـ zip جوه مجلد المشروع (`karima`) ووافق على استبدال الملفات الموجودة. بتتغيّر دي بس:
`app/page.js` · `next.config.mjs` · `components/ui/VideoCard.js` وكل ملفات `components/sections/` (Hero وAbout وBrands وServices وWorkflow وContact وProjects وProductShowcase)

الباقي ملفات جديدة. `data/projects.js` ومجلد `public/` ما بيتلمسوش.

## 2) ثبّت Firebase
```
npm i firebase
```

## 3) Firebase (بحساب Google بتاع العميلة)
1. console.firebase.google.com ← Add project.
2. Authentication ← Sign-in method ← فعّل Email/Password ← Users ← Add user (إيميل العميلة وباسورد قوي).
3. Authentication ← Settings ← User actions: لو لقيت "Enable create (sign-up)" اقفلها.
4. Firestore Database ← Create database ← Production mode.
5. Firestore ← Rules، الصق ده وغيّر الإيميل بإيميل العميلة (حروف صغيرة) وبعدين Publish:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{doc} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == 'client@gmail.com';
    }
  }
}
```
6. Project settings ← Your apps ← Web app (</>) ← خد الـ apiKey وauthDomain وprojectId وappId.

## 4) Cloudinary
Settings ← API Keys: خد Cloud name وAPI Key وAPI Secret.
ما تفعّلش "Strict transformations" لأن روابط الصور بتستخدم تحويلات.

## 5) Vercel ← Settings ← Environment Variables
الأسماء كلها في `.env.example`. بعد ما تضيفها اعمل Redeploy.

## 6) Git
قبل أي push شغّل `git status`. لو ظهرت ملفات `public/videos/...` كـ deleted اعمل `git restore public/`،
وإلا الفيديوهات القديمة هتتشال من الموقع.

## 7) جرّب
افتح `/admin` ← سجّل دخول ← ارفع فيديو وصورة ← افتح الموقع وتأكد إنهم ظهروا.

## حماية الـ credit (اللي اتعمل أوتوماتيك)
- الصور بتتضغط في المتصفح (حد أقصى 1200-1400px، WebP) قبل الرفع.
- الفيديو بحد أقصى 40MB (`MAX_VIDEO_MB` في `lib/upload.js`) وصيغ mp4/webm/mov بس.
- الفيديو بيتسلّم زي ما اترفع من غير تحويلات (تحويلات الفيديو بتتحسب بالثواني).
- الغلاف بيتاخد كلقطة من الفيديو في المتصفح، فمفيش تحويل فيديو على Cloudinary.
- الرفع بيقف لوحده عند 85% من الحد الشهري (`CLOUDINARY_MAX_PERCENT`) من غير ما يظهر عداد في الصفحة، وبتظهر رسالة لو الرفع اتوقف.
- مسح أي حاجة جديدة من الـ dashboard بيمسحها من Cloudinary وبيرجّع المساحة.
- لو رفع فشل في النص، الملفات اللي اترفعت بتتمسح أو بتتحفظ، ومفيش ملفات يتيمة.
- الفيديو مبيتحمّلش من الموقع غير لما الزائر يضغط Play.

## ملاحظات
- أي تعديل بيتحفظ لوحده والموقع بيتحدّث فوراً.
- مسح فيديو أو صورة قديمة (من GitHub) بيشيلها من الموقع بس.
- أضف `Disallow: /admin` في `app/robots.js`.

## أقسام الـ dashboard
النافبار فيه قسم لكل جزء في الموقع (الرئيسية، من أنا، البراندات، الخدمات، الفيديوهات، المنتجات، خطوات العمل، التواصل). الضغط على قسم بيفتح إعداداته بس.

## تاب "نصوص الموقع"
بيعدّل: الـ Hero (النصوص والصورة الرئيسية) · About (النبذة والأرقام) · البراندات · الخدمات · خطوات العمل · روابط التواصل.
أي خانة روابط فاضية بتستخدم القيمة الأصلية من `lib/site.js`.
مش متوصّل بالـ dashboard: Header وFooter وعناوين الأقسام الثابتة (زي "What I Create").

## تحليلات الزوار (Microsoft Clarity)
1. العميلة تعمل مشروع على https://clarity.microsoft.com بإيميلها وتنسخ الـ Project ID.
2. من Settings → Data Export تعمل API token.
3. في Vercel أضف: `NEXT_PUBLIC_CLARITY_ID` و `CLARITY_API_TOKEN` ثم Redeploy.
4. في `app/layout.js`: `import Analytics from "@/components/Analytics";` وضيف `<Analytics />` جوه `<body>`.
- الكود بيشتغل بس بعد موافقة الزائر على الكوكيز، ومبيشتغلش في /admin.
- تاب "الزوار" في اللوحة بيعرض آخر 3 أيام ومتخزن 12 ساعة (حد Clarity: 10 طلبات/يوم).
