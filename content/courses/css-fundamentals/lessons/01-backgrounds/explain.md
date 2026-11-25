# خلفيات العناصر في CSS

بنستخدم خصائص `background-*` عشان نتحكم في شكل خلفية أي عنصر.

## 1) وضع صورة كخلفية

```css
div {
    background-image: url("bg.jpg");
}
```

القيمة لازم تكون بالدالة `url()` وبداخلها مسار الصورة.

## 2) تكرار الصورة: `background-repeat`

| القيمة | المعنى |
|---|---|
| `repeat` | تكرار في الاتجاهين (الافتراضي) |
| `repeat-x` | تكرار أفقي فقط |
| `repeat-y` | تكرار رأسي فقط |
| `no-repeat` | مرة واحدة بدون تكرار |

## 3) مكان الصورة: `background-position`

```css
div {
    background-image: url("logo.png");
    background-repeat: no-repeat;
    background-position: top center;
}
```

> الترتيب مش مهم مع الكلمات المفتاحية: `right bottom` = `bottom right`.

## 4) تثبيت الخلفية: `background-attachment`

- `scroll` (الافتراضي): الخلفية بتتحرك مع العنصر.
- `fixed`: الخلفية ثابتة بالنسبة للشاشة.

## 5) حجم الصورة: `background-size`

- `cover`: تملا العنصر كله وممكن تتقص.
- `contain`: تظهر كاملة بدون قص وممكن يفضل فراغ.

## 6) التدرج اللوني: `linear-gradient`

```css
div {
    background: linear-gradient(to bottom, red, blue);
}
```

الاتجاهات: `to top` · `to bottom` · `to left` · `to right`.
