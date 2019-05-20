# boxExpand

## demo
[DEMO](https://kaaaaeeee.github.io/boxExpand/)



## setting
|オプション||type|初期値|説明|
|---|---|---|---|---|
|closeHeight||string|'0px'||
|isScrollAnimation||boolean|false||
|type|content|string|'default'|'default' or 'fadeout'|
||trigger|string|'default'|'default' or 'arrow'|
|showClass||string|'boxExpand-show'||
|openClass||string|'boxExpand-open'||
|contentCloakClass||string|'boxExpand-cloak'||
|contentFadeoutClass||string|'boxExpand-contents-fadeout'||
|triggerArrowClass||string|'boxExpand-trigger-arrow'||
|callback|initAfter|function|null||
||showAfter|function|null||
||hideAfter|function|null||
||scrollAfter|function|null||

## event
```
$('.boxExpand').on('boxExpandShow', function (event, boxExoand) {
  console.log(boxExpand);
});
```
- boxExpandInit
- boxExpandShow
- boxExpandHide
- boxExpandScroll

## method
```
$('.boxExpand').boxExpand('openBox');
```

- destroy
- openBox
- closeBox


## License
Copyright (c) 2019 kae kobayashi
 Licensed under the MIT License, see LICENSE.txt.
