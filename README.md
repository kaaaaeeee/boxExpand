# boxExpand

## demo
[DEMO](https://kaaaaeeee.github.io/boxExpand/)



## setting
|オプション名||type|初期値|説明|
|---|---|---|---|---|
|closeHeight||string|'0px'|閉じたときに見せるコンテンツの高さ|
|isScrollAnimation||boolean|false|閉じる時にスクロールアニメーションをつける|
|type|content|string|'default'|'default' or 'fadeout'<br>fadeoutを設定すると閉じた時コンテンツに白いグラデーションがつく|
||trigger|string|'default'|'default' or 'arrow'<br>arrowを設定するとtriggerに矢印がつく|
|showClass||string|'boxExpand-show'|開ききった状態時のクラス名|
|openClass||string|'boxExpand-open'|開いている状態時のクラス名|
|contentCloakClass||string|'boxExpand-cloak'|コンテンツを覆う要素のクラス名|
|contentFadeoutClass||string|'boxExpand-contents-fadeout'|type:{content: 'fadeout'}を設定した時に付与されるクラス名|
|triggerArrowClass||string|'boxExpand-trigger-arrow'|type:{trigger: 'arrow'}を設定した時に付与されるクラス名|
|callback|initAfter|function|null|初期設定終了時に実行されるコールバック|
||showAfter|function|null|開ききった時に実行されるコールバック|
||hideAfter|function|null|閉じきった時に実行されるコールバック|
||scrollAfter|function|null|スクロールアニメーション実行後に実行されるコールバック|

## event
```
$('.boxExpand').on('boxExpandShow', function (event, boxExoand) {
  console.log(boxExpand);
});
```
|オプション名|引数|説明|
|---|---|---|
|boxExpandInit|event, boxExpand|初期設定後実行される|
|boxExpandShow|event, boxExpand|アコーディオンを開いた後、実行される|
|boxExpandHide|event, boxExpand|アコーディオンを閉じた後、実行される|
|boxExpandScroll|event, boxExpand|isScrollAnimationがtrueに設定されていた時、アコーディオンを閉じた後スクロールアニメーションして実行される|

## method
```
$('.boxExpand').boxExpand('openBox');
```
|オプション名|説明|
|---|---|
|destroy|全てを削除する|
|openBox|アコーディオンを開く|
|closeBox|アコーディオンを閉じる|


## License
Copyright (c) 2019 kae kobayashi
 Licensed under the MIT License, see LICENSE.txt.
