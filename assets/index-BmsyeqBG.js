(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=o(a);fetch(a.href,n)}})();function js(e){const t=e.getContext("webgl2",{alpha:!1,antialias:!1,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!0,desynchronized:!1});if(!t)throw new Error("WebGL2 недоступен");return t.ext={colorFloat:t.getExtension("EXT_color_buffer_float"),floatLinear:t.getExtension("OES_texture_float_linear"),aniso:t.getExtension("EXT_texture_filter_anisotropic")},t.ext.colorFloat||console.warn("Нет EXT_color_buffer_float — HDR будет в 8 бит"),t}function ss(e,t,o,s=""){const a=e.createShader(t);if(e.shaderSource(a,o),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const n=e.getShaderInfoLog(a),r=o.split(`
`).map((i,c)=>`${String(c+1).padStart(4)}| ${i}`).join(`
`);throw new Error(`Шейдер ${s} не собрался:
${n}
${r}`)}return a}function vt(e,t,o,s="prog"){const a=ss(e,e.VERTEX_SHADER,t,s+".vert"),n=ss(e,e.FRAGMENT_SHADER,o,s+".frag"),r=e.createProgram();if(e.attachShader(r,a),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(`Программа ${s} не слинковалась: ${e.getProgramInfoLog(r)}`);e.deleteShader(a),e.deleteShader(n);const i={},c=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let h=0;h<c;h++){const d=e.getActiveUniform(r,h).name.replace(/\[0\]$/,"");i[d]=e.getUniformLocation(r,d)}const l={},u=e.getProgramParameter(r,e.ACTIVE_ATTRIBUTES);for(let h=0;h<u;h++){const p=e.getActiveAttrib(r,h);l[p.name]=e.getAttribLocation(r,p.name)}return{p:r,u:i,a:l,name:s}}function bt(e,t,o=e.ARRAY_BUFFER,s=e.STATIC_DRAW){const a=e.createBuffer();return e.bindBuffer(o,a),e.bufferData(o,t,s),e.bindBuffer(o,null),a}function Be(e,t,o,{float:s=!0,depth:a=!1,filter:n="linear"}={}){const r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r);const i=s&&e.ext.colorFloat,c=i?e.RGBA16F:e.RGBA8,l=i?e.HALF_FLOAT:e.UNSIGNED_BYTE;e.texImage2D(e.TEXTURE_2D,0,c,t,o,0,e.RGBA,l,null);const u=n==="linear"&&(!i||e.ext.floatLinear!==null)?e.LINEAR:e.NEAREST;e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const h=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,h),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0);let p=null;return a&&(p=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,p),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT24,t,o),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,p)),e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:r,fbo:h,rbo:p,w:t,h:o}}function as(e,t,o,s){if(t.w===o&&t.h===s)return t;e.deleteTexture(t.tex),e.deleteFramebuffer(t.fbo),t.rbo&&e.deleteRenderbuffer(t.rbo);const a=Be(e,o,s,{depth:!!t.rbo});return Object.assign(t,a),t}const Ks=`#version 300 es
out vec2 vUv;
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;function fe(e,t,o){return vt(e,Ks,t,o)}function de(e){e.drawArrays(e.TRIANGLES,0,3)}function he(e,t,o,s,a){e.activeTexture(e.TEXTURE0+s),e.bindTexture(e.TEXTURE_2D,a),t.u[o]&&e.uniform1i(t.u[o],s)}const Oo=`
vec3 hash33(vec3 p){
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float hash13(vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0,0,0)), n100 = hash13(i + vec3(1,0,0));
  float n010 = hash13(i + vec3(0,1,0)), n110 = hash13(i + vec3(1,1,0));
  float n001 = hash13(i + vec3(0,0,1)), n101 = hash13(i + vec3(1,0,1));
  float n011 = hash13(i + vec3(0,1,1)), n111 = hash13(i + vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float fbm(vec3 p, int oct){
  float a = 0.5, s = 0.0;
  for(int i = 0; i < 8; i++){
    if(i >= oct) break;
    s += a * vnoise(p);
    p *= 2.03; a *= 0.5;
  }
  return s;
}
// Гребневый шум — из него получаются филаменты космической паутины
float ridged(vec3 p, int oct){
  float a = 0.5, s = 0.0;
  for(int i = 0; i < 8; i++){
    if(i >= oct) break;
    float n = 1.0 - abs(vnoise(p) * 2.0 - 1.0);
    s += a * n * n;
    p *= 2.11; a *= 0.5;
  }
  return s;
}`,Xs=`
vec3 acesFilm(vec3 x){
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
vec3 toSRGB(vec3 c){
  return mix(c * 12.92, 1.055 * pow(max(c, 1e-5), vec3(1.0/2.4)) - 0.055, step(0.0031308, c));
}`;function to(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Qs(e,t,o,s,a){const n=1/Math.tan(t/2);e[0]=n/o,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0;const r=1/(s-a);return e[10]=(a+s)*r,e[14]=2*a*s*r,e}function Zs(e,t,o,s){let a=t[0]-o[0],n=t[1]-o[1],r=t[2]-o[2],i=Math.hypot(a,n,r);i<1e-20&&(a=0,n=0,r=1,i=1),a/=i,n/=i,r/=i;let c=s[1]*r-s[2]*n,l=s[2]*a-s[0]*r,u=s[0]*n-s[1]*a;i=Math.hypot(c,l,u),i<1e-20&&(c=1,l=0,u=0,i=1),c/=i,l/=i,u/=i;const h=n*u-r*l,p=r*c-a*u,d=a*l-n*c;return e[0]=c,e[1]=h,e[2]=a,e[3]=0,e[4]=l,e[5]=p,e[6]=n,e[7]=0,e[8]=u,e[9]=d,e[10]=r,e[11]=0,e[12]=-(c*t[0]+l*t[1]+u*t[2]),e[13]=-(h*t[0]+p*t[1]+d*t[2]),e[14]=-(a*t[0]+n*t[1]+r*t[2]),e[15]=1,e}function Js(e,t,o){for(let s=0;s<4;s++){const a=o[s*4],n=o[s*4+1],r=o[s*4+2],i=o[s*4+3];e[s*4]=t[0]*a+t[4]*n+t[8]*r+t[12]*i,e[s*4+1]=t[1]*a+t[5]*n+t[9]*r+t[13]*i,e[s*4+2]=t[2]*a+t[6]*n+t[10]*r+t[14]*i,e[s*4+3]=t[3]*a+t[7]*n+t[11]*r+t[15]*i}return e}const T=(e,t,o)=>e<t?t:e>o?o:e,v=(e,t,o)=>e+(t-e)*o,g=(e,t,o)=>{const s=T((o-e)/(t-e),0,1);return s*s*(3-2*s)};function q(e){let t=e>>>0;return function(){t|=0,t=t+1831565813|0;let o=Math.imul(t^t>>>15,1|t);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function P(e){let t=0,o=0;for(;t===0;)t=e();for(;o===0;)o=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*o)}function it(e){const t=T(e,-.4,2),o=4600*(1/(.92*t+1.7)+1/(.92*t+.62));return ta(o)}function ta(e){const t=T(e,1e3,4e4)/100;let o,s,a;return t<=66?(o=255,s=99.4708025861*Math.log(t)-161.1195681661,a=t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307):(o=329.698727446*Math.pow(t-60,-.1332047592),s=288.1221695283*Math.pow(t-60,-.0755148492),a=255),[T(o,0,255)/255,T(s,0,255)/255,T(a,0,255)/255]}const ea=[[-.3,4.6],[1.2,3.9],[2.6,2.6],[4.1,2],[5.6,1.35],[7.1,.95],[8.6,1.45],[10,1.55],[11.5,1.55],[13,1.45],[14.6,1.25],[16.4,1.05],[18,.9],[19.4,.72],[20.4,.58],[21,.52],[21.8,.56],[22.6,.85],[24,.98],[25.2,1.05],[26.2,.98],[27.2,.85]];function oa(e,t){if(t<=e[0][0])return e[0][1];const o=e[e.length-1];if(t>=o[0])return o[1];for(let s=1;s<e.length;s++){const[a,n]=e[s];if(t<=a){const[r,i]=e[s-1];return i+(n-i)*g(r,a,t)}}return o[1]}function sa(e){return oa(ea,e)}const aa=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTex;
uniform float uThreshold, uKnee;
void main(){
  vec3 c = texture(uTex, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  // мягкое колено, иначе звёзды «щёлкают» при переходе через порог
  float soft = clamp(br - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 1e-4);
  float w = max(soft, br - uThreshold) / max(br, 1e-4);
  o = vec4(c * w, 1.0);
}`,na=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTex;
uniform vec2 uTexel;
void main(){
  // 13-тапный фильтр из презентации Call of Duty — не мерцает на движении
  vec3 a = texture(uTex, vUv + uTexel * vec2(-2,-2)).rgb;
  vec3 b = texture(uTex, vUv + uTexel * vec2( 0,-2)).rgb;
  vec3 c = texture(uTex, vUv + uTexel * vec2( 2,-2)).rgb;
  vec3 d = texture(uTex, vUv + uTexel * vec2(-2, 0)).rgb;
  vec3 e = texture(uTex, vUv).rgb;
  vec3 f = texture(uTex, vUv + uTexel * vec2( 2, 0)).rgb;
  vec3 g = texture(uTex, vUv + uTexel * vec2(-2, 2)).rgb;
  vec3 h = texture(uTex, vUv + uTexel * vec2( 0, 2)).rgb;
  vec3 i = texture(uTex, vUv + uTexel * vec2( 2, 2)).rgb;
  vec3 j = texture(uTex, vUv + uTexel * vec2(-1,-1)).rgb;
  vec3 k = texture(uTex, vUv + uTexel * vec2( 1,-1)).rgb;
  vec3 l = texture(uTex, vUv + uTexel * vec2(-1, 1)).rgb;
  vec3 m = texture(uTex, vUv + uTexel * vec2( 1, 1)).rgb;
  vec3 r = e * 0.125;
  r += (a + c + g + i) * 0.03125;
  r += (b + d + f + h) * 0.0625;
  r += (j + k + l + m) * 0.125;
  o = vec4(r, 1.0);
}`,ia=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uRadius;
void main(){
  vec2 t = uTexel * uRadius;
  vec3 s = texture(uTex, vUv + vec2(-t.x,-t.y)).rgb * 0.0625;
  s += texture(uTex, vUv + vec2( 0.0,-t.y)).rgb * 0.125;
  s += texture(uTex, vUv + vec2( t.x,-t.y)).rgb * 0.0625;
  s += texture(uTex, vUv + vec2(-t.x, 0.0)).rgb * 0.125;
  s += texture(uTex, vUv).rgb * 0.25;
  s += texture(uTex, vUv + vec2( t.x, 0.0)).rgb * 0.125;
  s += texture(uTex, vUv + vec2(-t.x, t.y)).rgb * 0.0625;
  s += texture(uTex, vUv + vec2( 0.0, t.y)).rgb * 0.125;
  s += texture(uTex, vUv + vec2( t.x, t.y)).rgb * 0.0625;
  o = vec4(s, 1.0);
}`,ra=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uScene, uBloom;
uniform float uBloomAmount, uExposure, uVignette, uGrain, uTime, uWarp, uFade;
uniform vec2 uRes;
${Xs}
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main(){
  vec2 uv = vUv;

  // Радиальный смаз на варпе: продаёт скорость лучше любого шлейфа частиц
  vec3 c;
  if(uWarp > 0.003){
    vec2 dir = (uv - 0.5);
    c = vec3(0.0);
    float wsum = 0.0;
    const int N = 8;
    for(int i = 0; i < N; i++){
      float f = float(i) / float(N - 1);
      float k = 1.0 - f * uWarp * 0.16;
      float w = 1.0 - f * 0.55;
      // лёгкая хроматика по каналам — «оптика», а не «фильтр»
      vec2 suv = 0.5 + dir * k;
      c.r += texture(uScene, 0.5 + dir * (k + 0.0018 * uWarp)).r * w;
      c.g += texture(uScene, suv).g * w;
      c.b += texture(uScene, 0.5 + dir * (k - 0.0018 * uWarp)).b * w;
      wsum += w;
    }
    c /= wsum;
  } else {
    c = texture(uScene, uv).rgb;
  }

  vec3 b = texture(uBloom, uv).rgb;
  c += b * uBloomAmount;
  c *= uExposure;
  c = acesFilm(c);

  float d = length((uv - 0.5) * vec2(uRes.x / uRes.y, 1.0));
  c *= mix(1.0, smoothstep(1.15, 0.35, d), uVignette);

  // Зерно: маскирует бандинг на градиентах туманностей
  float g = hash12(gl_FragCoord.xy + vec2(uTime * 137.0, uTime * 71.0)) - 0.5;
  c += g * uGrain * (0.6 + 0.4 * (1.0 - dot(c, vec3(0.333))));

  c *= uFade;
  o = vec4(toSRGB(max(c, 0.0)), 1.0);
}`;class ca{constructor(t,o){this.gl=t,this.canvas=o,this.dpr=Math.min(window.devicePixelRatio||1,2),this.w=1,this.h=1,this.scene=Be(t,2,2,{depth:!0}),this.bright=Be(t,2,2),this.mips=[],this.MIP_COUNT=6,this.progBright=fe(t,aa,"bright"),this.progDown=fe(t,na,"down"),this.progUp=fe(t,ia,"up"),this.progComposite=fe(t,ra,"composite"),this.vao=t.createVertexArray(),this.settings={exposure:1,bloom:.55,threshold:.95,knee:.32,vignette:.55,grain:.01,bloomRadius:1}}resize(t,o,s){const a=this.gl,n=s??this.dpr,r=Math.max(2,Math.round(t*n)),i=Math.max(2,Math.round(o*n));if(r===this.w&&i===this.h)return;this.w=r,this.h=i,this.canvas.width=r,this.canvas.height=i,as(a,this.scene,r,i),as(a,this.bright,r>>1,i>>1);for(const u of this.mips)a.deleteTexture(u.tex),a.deleteFramebuffer(u.fbo);this.mips=[];let c=r>>1,l=i>>1;for(let u=0;u<this.MIP_COUNT;u++)c=Math.max(1,c>>1),l=Math.max(1,l>>1),this.mips.push(Be(a,c,l))}beginScene(){const t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.scene.fbo),t.viewport(0,0,this.w,this.h),t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL)}clearDepth(){const t=this.gl;t.clearDepth(1),t.clear(t.DEPTH_BUFFER_BIT)}present({time:t=0,warp:o=0,fade:s=1,L:a=null}={}){const n=this.gl,r=this.settings,i=r.exposure*(a===null?1:sa(a));n.bindVertexArray(this.vao),n.disable(n.DEPTH_TEST),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,this.bright.fbo),n.viewport(0,0,this.bright.w,this.bright.h),n.useProgram(this.progBright.p),he(n,this.progBright,"uTex",0,this.scene.tex),n.uniform1f(this.progBright.u.uThreshold,r.threshold),n.uniform1f(this.progBright.u.uKnee,r.knee),de(n);let c=this.bright;n.useProgram(this.progDown.p);for(const u of this.mips)n.bindFramebuffer(n.FRAMEBUFFER,u.fbo),n.viewport(0,0,u.w,u.h),he(n,this.progDown,"uTex",0,c.tex),n.uniform2f(this.progDown.u.uTexel,1/c.w,1/c.h),de(n),c=u;n.useProgram(this.progUp.p),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE);for(let u=this.mips.length-1;u>0;u--){const h=this.mips[u],p=this.mips[u-1];n.bindFramebuffer(n.FRAMEBUFFER,p.fbo),n.viewport(0,0,p.w,p.h),he(n,this.progUp,"uTex",0,h.tex),n.uniform2f(this.progUp.u.uTexel,1/h.w,1/h.h),n.uniform1f(this.progUp.u.uRadius,r.bloomRadius),de(n)}n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,this.w,this.h),n.useProgram(this.progComposite.p),he(n,this.progComposite,"uScene",0,this.scene.tex),he(n,this.progComposite,"uBloom",1,this.mips[0].tex);const l=this.progComposite.u;n.uniform1f(l.uBloomAmount,r.bloom),n.uniform1f(l.uExposure,i),n.uniform1f(l.uVignette,r.vignette),n.uniform1f(l.uGrain,r.grain),n.uniform1f(l.uTime,t),n.uniform1f(l.uWarp,o),n.uniform1f(l.uFade,s),n.uniform2f(l.uRes,this.w,this.h),de(n),n.bindVertexArray(null)}}const la=(e,t,o,s)=>{const a=Math.abs(e)%10,n=Math.abs(e)%100;return a===1&&n!==11?t:a>=2&&a<=4&&(n<10||n>=20)?o:s},Mo={"meta.title":"От человека до края Вселенной","meta.desc":"Логарифмический зум сквозь 27 порядков масштаба: от ладони до наблюдаемой Вселенной. Настоящие расстояния, настоящие каталоги звёзд и галактик.","meta.ogTitle":"От человека до края Вселенной","meta.ogDesc":"27 порядков масштаба за три минуты. Или сколько захочешь — крути сам.","loader.title":"Собираем Вселенную","loader.note":"звёзды, галактики, пустота","start.h1":"От человека<br />до края Вселенной","start.sub":"27 порядков масштаба. Настоящие расстояния.","start.go":"Поехали","start.free":"Крутить самому","start.foot":"Со звуком — сильно лучше. Наушники не помешают.","hud.frameRadius":"радиус кадра","hud.lightTravel":"свет идёт","hud.hint":"колесо — зум · перетаскивание — поворот","ctl.play":"Пауза / продолжить","ctl.playAria":"Пауза","ctl.sound":"Звук","ctl.mode":"Свободный режим","ctl.info":"О проекте","ctl.lang":"Язык","ctl.close":"Закрыть","about.h2":"Что здесь настоящее","about.li1":"<b>Расстояния</b> — настоящие: большие полуоси орбит, параллаксы звёзд, красные смещения галактик.","about.li2":"<b>Звёзды</b> — каталог HYG (Hipparcos + Yale + Gliese), около 118 тысяч штук с реальными координатами и цветами по индексу B−V.","about.li3":"<b>Галактики</b> — каталог 2MRS, 44 599 объектов ближней Вселенной.","about.li4":"<b>Размеры планет</b> — увеличены. При кадре в две астрономические единицы Земля занимает четыре стотысячных кадра, то есть ничего. Иначе Солнечная система выглядела бы пустым чёрным кругом.","about.li5":"<b>Кадр с Землёй, Луной и Солнцем</b> — постановочный: настоящее Солнце с орбиты Земли — диск в полградуса, как Луна с балкона. Направление света честное, преувеличены размер и близость.","about.li6":"<b>Млечный Путь, космическая паутина</b> — процедурные модели по опубликованным параметрам: длина шкалы диска 2,6 кпк, Солнце в 8,178 кпк от центра, вещество в нитях и узлах, объём в пустотах.","about.foot":"Сделано на WebGL2, звук синтезируется в браузере в реальном времени и привязан к логарифму масштаба.","about.sources":"Источники данных: {list}","src.stars":"звёзд","src.galaxies":"галактик","src.procedural":"процедурная замена {name}","mark.human":"человек","mark.city":"город","mark.earth":"Земля","mark.moon":"Луна","mark.au":"1 а.е.","mark.neptune":"Нептун","mark.ly":"св. год","mark.ly90":"90 св. лет","mark.galaxy":"Галактика","mark.group":"группа","mark.laniakea":"Ланиакея","mark.all":"всё","shell.human":"человек","shell.earth":"Земля","shell.moon":"орбита Луны","shell.inner":"планеты","shell.outer":"пояс Койпера","shell.oort":"облако Оорта","shell.stars":"каталог звёзд","shell.galaxy":"Млечный Путь","shell.group":"Местная группа","shell.supercluster":"каталог галактик","shell.cosmicweb":"космическая паутина","unit.Gpc":"Гпк","unit.Mpc":"Мпк","unit.ly":"св. лет","unit.au":"а.е.","unit.km":"км","unit.m":"м","num.trillion":"{v} трлн","num.billion":"{v} млрд","num.million":"{v} млн","num.thousand":"{v} тыс.","time.ns":"{v} нс","time.us":"{v} мкс","time.ms":"{v} мс","time.sec":"{v} с","time.minsec":"{m} мин {s} с","time.hours":"{v} ч","time.days":(e,t)=>`${t(e.v)} ${la(e.v,"день","дня","дней")}`,"time.years":"{v} лет","stop.human.title":"Человек","stop.human.size":"{v} м","stop.human.fact":"Атомы в твоём теле собраны внутри звёзд. Всё, кроме водорода, — переплавлено в звёздных недрах и разбросано взрывами.","stop.human.short":"Ты сделан из звёздного пепла","stop.city.title":"Город","stop.city.size":"{v} км","stop.city.fact":"На этой высоте летают самолёты. Выше — уже почти нечем дышать: четыре пятых всего воздуха планеты осталось внизу.","stop.city.short":"80 % воздуха — ниже этой линии","stop.earth.title":"Земля","stop.earth.size":"{v} км","stop.earth.fact":"Вся история человечества — всё, что кто-либо когда-либо чувствовал, — уместилась на этом шарике.","stop.earth.short":"Здесь произошло вообще всё, что ты знаешь","stop.moon.title":"Орбита Луны","stop.moon.size":"{v} км","stop.moon.fact":"В этот зазор между Землёй и Луной помещаются ВСЕ планеты Солнечной системы. Впритык, но помещаются.","stop.moon.short":"Сюда влезают все планеты системы","stop.sun.title":"Солнце","stop.sun.size":"диаметр — {v} млн км","stop.sun.fact":"Внутри Солнца поместится миллион триста тысяч таких шариков, как наша Земля. Вон она, кстати.","stop.sun.short":"1 300 000 Земель внутри","stop.au.title":"Орбита Земли","stop.au.size":"1 а.е. = {v} км","stop.au.fact":"Свет от Солнца летит к Земле 8 минут 20 секунд. Ты никогда не видел Солнце — только его прошлое.","stop.au.short":"Солнце, которое ты видишь, — восьмиминутной давности","stop.outer.title":"Солнечная система","stop.outer.size":"до Нептуна — {v} а.е.","stop.outer.fact":"До Нептуна отсюда — 4,5 миллиарда километров. Ехать на машине по трассе — пять тысяч лет. Без остановок.","stop.outer.short":"До Нептуна — пять тысяч лет на машине","stop.heliopause.title":"Край солнечного ветра","stop.heliopause.size":"≈ {v} а.е.","stop.heliopause.fact":"«Вояджер-1» летит здесь 49 лет — 61 000 километров в час — и даже не добрался до окраины Солнечной системы.","stop.heliopause.short":"Вояджер летит сюда с 1977 года","stop.oort.title":"Облако Оорта","stop.oort.size":"≈ {v} светового года","stop.oort.fact":"Триллион ледяных комет висит здесь в темноте. Изредка одна срывается вниз, разгорается на подлёте — и целые народы читали в ней знамение.","stop.oort.short":"Триллион комет ждёт своей очереди","stop.proxima.title":"Ближайшая звезда","stop.proxima.size":"Проксима Центавра — {v} св. года","stop.proxima.fact":"Даже на рекордной скорости самого быстрого аппарата человечества лететь туда 6 600 лет. Это ближайшая звезда. Ближе не бывает.","stop.proxima.short":"Ближайшая звезда: 6 600 лет пути","stop.bubble.title":"Наш радиопузырь","stop.bubble.size":"≈ {v} световых лет","stop.bubble.fact":"Радио включили сто лет назад — и вот докуда дошло. Дальше Вселенная о нас ещё не знает.","stop.bubble.short":"Дальше о нас никто не слышал","stop.galaxy.title":"Млечный Путь","stop.galaxy.size":"{v} световых лет","stop.galaxy.fact":"Сто миллиардов звёзд. Или четыреста — изнутри не сосчитать. По звезде в секунду это от трёх до двенадцати тысяч лет подряд.","stop.galaxy.short":"От 100 до 400 миллиардов звёзд","stop.localgroup.title":"Местная группа","stop.localgroup.size":"≈ {v} млн световых лет","stop.localgroup.fact":"Андромеда идёт на нас со скоростью 110 км/с. Столкнёмся ли — уже не факт: свежие расчёты дают примерно пятьдесят на пятьдесят.","stop.localgroup.short":"Андромеда идёт на нас. Пятьдесят на пятьдесят","stop.laniakea.title":"Ланиакея","stop.laniakea.size":"{v} млн световых лет","stop.laniakea.fact":"Наше сверхскопление. Сто тысяч галактик течёт в одну точку — к Великому Аттрактору, которого мы даже не видим.","stop.laniakea.short":"Нас всех куда-то тянет","stop.universe.title":"Наблюдаемая Вселенная","stop.universe.size":"{v} миллиарда световых лет","stop.universe.fact":"Дальше смотреть нельзя — не потому что там ничего нет, а потому что свет оттуда ещё не успел долететь за 13,8 млрд лет.","stop.universe.short":"Дальше свет ещё не долетел","compare.m1":"Твой город — вот эта искра","compare.m2":"Луна. Три дня пути","compare.m3":"Земля — эта точка. Солнце в 109 раз шире","compare.m4":"Солнце отсюда — просто одна из звёзд","hero.here":"Это — ты.","hero.there":"А это — всё остальное.","hero.real":"А теперь — медленно.","report.prologue":"Пролог (хук)","report.prologueNote":"вылет до края и обратно","report.outro":"Финал","report.outroNote":"перемотка домой","report.decades":"{d} декад · {s} с/декаду"},ua=(e,t,o)=>Math.abs(e)===1?t:o,Ce={"meta.title":"From a Human to the Edge of the Universe","meta.desc":"A logarithmic zoom across 27 orders of magnitude: from your palm to the observable Universe. Real distances, real catalogues of stars and galaxies.","meta.ogTitle":"From a Human to the Edge of the Universe","meta.ogDesc":"27 orders of magnitude in three minutes. Or as long as you like — drive it yourself.","loader.title":"Assembling the Universe","loader.note":"stars, galaxies, emptiness","start.h1":"From a human<br />to the edge of the Universe","start.sub":"27 orders of magnitude. Real distances.","start.go":"Let's go","start.free":"Drive it myself","start.foot":"Much better with sound. Headphones wouldn't hurt.","hud.frameRadius":"frame radius","hud.lightTravel":"light takes","hud.hint":"wheel — zoom · drag — rotate","ctl.play":"Pause / resume","ctl.playAria":"Pause","ctl.sound":"Sound","ctl.mode":"Free mode","ctl.info":"About","ctl.lang":"Language","ctl.close":"Close","about.h2":"What here is real","about.li1":"<b>The distances</b> are real: orbital semi-major axes, stellar parallaxes, galaxy redshifts.","about.li2":"<b>The stars</b> come from the HYG catalogue (Hipparcos + Yale + Gliese) — about 118 thousand of them, with real coordinates and colours from the B−V index.","about.li3":"<b>The galaxies</b> come from the 2MRS catalogue: 44,599 objects of the nearby Universe.","about.li4":"<b>Planet sizes</b> are exaggerated. In a frame two astronomical units across, Earth would take up four hundred-thousandths of it — that is, nothing. Otherwise the Solar System would look like an empty black circle.","about.li5":"<b>The shot with Earth, the Moon and the Sun</b> is staged: the real Sun from Earth's orbit is a half-degree disc, the same as the Moon from your balcony. The direction of the light is honest; the size and the closeness are not.","about.li6":"<b>The Milky Way and the cosmic web</b> are procedural models built on published parameters: disc scale length 2.6 kpc, the Sun 8.178 kpc from the centre, matter in filaments and knots, emptiness in the voids.","about.foot":"Built on WebGL2; the sound is synthesised in the browser in real time and tied to the logarithm of the scale.","about.sources":"Data sources: {list}","src.stars":"stars","src.galaxies":"galaxies","src.procedural":"procedural stand-in for {name}","mark.human":"human","mark.city":"city","mark.earth":"Earth","mark.moon":"Moon","mark.au":"1 au","mark.neptune":"Neptune","mark.ly":"light year","mark.ly90":"90 ly","mark.galaxy":"Galaxy","mark.group":"group","mark.laniakea":"Laniakea","mark.all":"everything","shell.human":"a human","shell.earth":"Earth","shell.moon":"the Moon's orbit","shell.inner":"planets","shell.outer":"Kuiper belt","shell.oort":"Oort cloud","shell.stars":"star catalogue","shell.galaxy":"Milky Way","shell.group":"Local Group","shell.supercluster":"galaxy catalogue","shell.cosmicweb":"cosmic web","unit.Gpc":"Gpc","unit.Mpc":"Mpc","unit.ly":"ly","unit.au":"au","unit.km":"km","unit.m":"m","num.trillion":"{v}T","num.billion":"{v}B","num.million":"{v}M","num.thousand":"{v}k","time.ns":"{v} ns","time.us":"{v} µs","time.ms":"{v} ms","time.sec":"{v} s","time.minsec":"{m} min {s} s","time.hours":"{v} h","time.days":(e,t)=>`${t(e.v)} ${ua(e.v,"day","days")}`,"time.years":"{v} years","stop.human.title":"A human","stop.human.size":"{v} m","stop.human.fact":"The atoms in your body were put together inside stars. Everything but hydrogen was forged in stellar cores and scattered by explosions.","stop.human.short":"You are made of stellar ash","stop.city.title":"A city","stop.city.size":"{v} km","stop.city.fact":"This is the altitude where airliners fly. Higher up there is almost nothing left to breathe: four fifths of the planet's air is already below you.","stop.city.short":"80% of the air is below this line","stop.earth.title":"Earth","stop.earth.size":"{v} km","stop.earth.fact":"The whole history of humankind — everything anyone has ever felt — fits on this little ball.","stop.earth.short":"Everything you know happened here","stop.moon.title":"The Moon's orbit","stop.moon.size":"{v} km","stop.moon.fact":"Every planet in the Solar System fits into the gap between Earth and the Moon. Barely — but they fit.","stop.moon.short":"All the planets fit in here","stop.sun.title":"The Sun","stop.sun.size":"diameter — {v} million km","stop.sun.fact":"One million three hundred thousand balls like our Earth would fit inside the Sun. There it is, by the way.","stop.sun.short":"1,300,000 Earths inside","stop.au.title":"Earth's orbit","stop.au.size":"1 au = {v} km","stop.au.fact":"Sunlight takes 8 minutes 20 seconds to reach Earth. You have never seen the Sun — only its past.","stop.au.short":"The Sun you see is eight minutes old","stop.outer.title":"The Solar System","stop.outer.size":"to Neptune — {v} au","stop.outer.fact":"Neptune is 4.5 billion kilometres from here. Driving down a motorway, non-stop — a five-thousand-year road trip.","stop.outer.short":"Neptune: a 5,000-year road trip","stop.heliopause.title":"The edge of the solar wind","stop.heliopause.size":"≈ {v} au","stop.heliopause.fact":"Voyager 1 has been flying out here for 49 years — at 61,000 kilometres per hour — and it still has not reached the outskirts of the Solar System.","stop.heliopause.short":"Voyager has been flying since 1977","stop.oort.title":"The Oort cloud","stop.oort.size":"≈ {v} light years","stop.oort.fact":"A trillion icy comets hang out here in the dark. Once in a while one drops inward, catches fire on the way in — and whole nations read an omen in it.","stop.oort.short":"A trillion comets waiting their turn","stop.proxima.title":"The nearest star","stop.proxima.size":"Proxima Centauri — {v} light years","stop.proxima.fact":"Even at the record speed of the fastest craft humanity has ever built, the trip takes 6,600 years. And this is the nearest star. There is nothing closer.","stop.proxima.short":"The nearest star: 6,600 years away","stop.bubble.title":"Our radio bubble","stop.bubble.size":"≈ {v} light years","stop.bubble.fact":"We switched on the radio a hundred years ago — and this is how far it has got. Beyond this, the Universe has not heard of us yet.","stop.bubble.short":"Beyond this, nobody has heard of us","stop.galaxy.title":"The Milky Way","stop.galaxy.size":"{v} light years","stop.galaxy.fact":"A hundred billion stars. Or four hundred — from the inside there is no counting them. One star a second, and that is three to twelve thousand years straight.","stop.galaxy.short":"Between 100 and 400 billion stars","stop.localgroup.title":"The Local Group","stop.localgroup.size":"≈ {v} million light years","stop.localgroup.fact":"Andromeda is coming at us at 110 km/s. Whether we actually collide is no longer settled: the latest calculations make it roughly fifty-fifty.","stop.localgroup.short":"Andromeda is coming. Fifty-fifty","stop.laniakea.title":"Laniakea","stop.laniakea.size":"{v} million light years","stop.laniakea.fact":"Our supercluster. A hundred thousand galaxies streaming towards one point — the Great Attractor, which we cannot even see.","stop.laniakea.short":"Something is pulling us all somewhere","stop.universe.title":"The observable Universe","stop.universe.size":"{v} billion light years","stop.universe.fact":"You cannot look any further — not because nothing is there, but because in 13.8 billion years the light from there has not had time to arrive.","stop.universe.short":"Beyond this, the light has not arrived yet","compare.m1":"Your city is that spark","compare.m2":"The Moon. Three days away","compare.m3":"Earth is that dot. The Sun is 109 times wider","compare.m4":"From here the Sun is just one more star","hero.here":"This is you.","hero.there":"And this is everything else.","hero.real":"Now — slowly.","report.prologue":"Prologue (hook)","report.prologueNote":"out to the edge and back","report.outro":"Outro","report.outroNote":"rewind home","report.decades":"{d} decades · {s} s/decade"},ha=(e,t,o)=>Math.abs(e)===1?t:o,pa={"meta.title":"Del ser humano al borde del Universo","meta.desc":"Un zoom logarítmico a través de 27 órdenes de magnitud: de la palma de la mano al Universo observable. Distancias reales, catálogos reales de estrellas y galaxias.","meta.ogTitle":"Del ser humano al borde del Universo","meta.ogDesc":"27 órdenes de magnitud en tres minutos. O los que quieras: muévelo tú mismo.","loader.title":"Montando el Universo","loader.note":"estrellas, galaxias, vacío","start.h1":"Del ser humano<br />al borde del Universo","start.sub":"27 órdenes de magnitud. Distancias reales.","start.go":"Vamos","start.free":"Explorar por mi cuenta","start.foot":"Con sonido es mucho mejor. Unos auriculares no sobran.","hud.frameRadius":"radio del cuadro","hud.lightTravel":"la luz tarda","hud.hint":"rueda — zoom · arrastrar — girar","ctl.play":"Pausa / continuar","ctl.playAria":"Pausa","ctl.sound":"Sonido","ctl.mode":"Modo libre","ctl.info":"Sobre el proyecto","ctl.lang":"Idioma","ctl.close":"Cerrar","about.h2":"Qué hay de real aquí","about.li1":"<b>Las distancias</b> son reales: semiejes mayores de las órbitas, paralajes estelares, corrimientos al rojo de las galaxias.","about.li2":"<b>Las estrellas</b> salen del catálogo HYG (Hipparcos + Yale + Gliese): unas 118 mil, con coordenadas reales y colores según el índice B−V.","about.li3":"<b>Las galaxias</b> salen del catálogo 2MRS: 44 599 objetos del Universo cercano.","about.li4":"<b>El tamaño de los planetas</b> está aumentado. En un cuadro de dos unidades astronómicas la Tierra ocuparía cuatro cienmilésimas partes, o sea, nada. Si no, el Sistema Solar sería un círculo negro y vacío.","about.li5":"<b>El plano con la Tierra, la Luna y el Sol</b> está montado: el Sol real desde la órbita terrestre es un disco de medio grado, igual que la Luna desde el balcón. La dirección de la luz es honesta; el tamaño y la cercanía, exagerados.","about.li6":"<b>La Vía Láctea y la red cósmica</b> son modelos procedurales con parámetros publicados: longitud de escala del disco 2,6 kpc, el Sol a 8,178 kpc del centro, materia en filamentos y nodos, vacío en los huecos.","about.foot":"Hecho con WebGL2; el sonido se sintetiza en el navegador en tiempo real y va atado al logaritmo de la escala.","about.sources":"Fuentes de datos: {list}","src.stars":"estrellas","src.galaxies":"galaxias","src.procedural":"sustituto procedural de {name}","mark.human":"humano","mark.city":"ciudad","mark.earth":"Tierra","mark.moon":"Luna","mark.au":"1 ua","mark.neptune":"Neptuno","mark.ly":"año luz","mark.ly90":"90 años luz","mark.galaxy":"Galaxia","mark.group":"grupo","mark.laniakea":"Laniakea","mark.all":"todo","shell.human":"un humano","shell.earth":"la Tierra","shell.moon":"la órbita de la Luna","shell.inner":"planetas","shell.outer":"cinturón de Kuiper","shell.oort":"nube de Oort","shell.stars":"catálogo de estrellas","shell.galaxy":"Vía Láctea","shell.group":"Grupo Local","shell.supercluster":"catálogo de galaxias","shell.cosmicweb":"red cósmica","unit.Gpc":"Gpc","unit.Mpc":"Mpc","unit.ly":"años luz","unit.au":"ua","unit.km":"km","unit.m":"m","num.trillion":"{v} bill.","num.billion":"{v} mil M","num.million":"{v} M","num.thousand":"{v} mil","time.ns":"{v} ns","time.us":"{v} µs","time.ms":"{v} ms","time.sec":"{v} s","time.minsec":"{m} min {s} s","time.hours":"{v} h","time.days":(e,t)=>`${t(e.v)} ${ha(e.v,"día","días")}`,"time.years":"{v} años","stop.human.title":"Un ser humano","stop.human.size":"{v} m","stop.human.fact":"Los átomos de tu cuerpo se armaron dentro de estrellas. Todo, salvo el hidrógeno, se fundió en sus entrañas y lo esparcieron las explosiones.","stop.human.short":"Estás hecho de ceniza estelar","stop.city.title":"Una ciudad","stop.city.size":"{v} km","stop.city.fact":"A esta altura vuelan los aviones. Más arriba ya casi no queda nada que respirar: cuatro quintas partes del aire del planeta se quedaron abajo.","stop.city.short":"El 80 % del aire queda bajo esta línea","stop.earth.title":"La Tierra","stop.earth.size":"{v} km","stop.earth.fact":"Toda la historia de la humanidad — todo lo que alguien haya sentido alguna vez — cabe en esta bolita.","stop.earth.short":"Aquí pasó todo lo que conoces","stop.moon.title":"La órbita de la Luna","stop.moon.size":"{v} km","stop.moon.fact":"En el hueco entre la Tierra y la Luna caben TODOS los planetas del Sistema Solar. Justitos, pero caben.","stop.moon.short":"Aquí caben todos los planetas","stop.sun.title":"El Sol","stop.sun.size":"diámetro — {v} millones de km","stop.sun.fact":"Dentro del Sol caben un millón trescientas mil esferas como nuestra Tierra. Ahí está, por cierto.","stop.sun.short":"1 300 000 Tierras dentro","stop.au.title":"La órbita de la Tierra","stop.au.size":"1 ua = {v} km","stop.au.fact":"La luz del Sol tarda 8 minutos y 20 segundos en llegar a la Tierra. Nunca has visto el Sol: solo su pasado.","stop.au.short":"El Sol que ves tiene ocho minutos","stop.outer.title":"El Sistema Solar","stop.outer.size":"hasta Neptuno — {v} ua","stop.outer.fact":"Neptuno está a 4500 millones de kilómetros de aquí. En coche por una autopista, sin parar — un viaje de cinco mil años.","stop.outer.short":"Neptuno: 5000 años en coche","stop.heliopause.title":"El borde del viento solar","stop.heliopause.size":"≈ {v} ua","stop.heliopause.fact":"La Voyager 1 lleva 49 años volando por aquí — a 61 000 kilómetros por hora — y todavía no ha llegado a las afueras del Sistema Solar.","stop.heliopause.short":"La Voyager vuela hacia aquí desde 1977","stop.oort.title":"La nube de Oort","stop.oort.size":"≈ {v} años luz","stop.oort.fact":"Un billón de cometas de hielo cuelga aquí en la oscuridad. De vez en cuando uno se descuelga hacia dentro, se enciende al acercarse, y pueblos enteros leyeron en él un presagio.","stop.oort.short":"Un billón de cometas esperando su turno","stop.proxima.title":"La estrella más cercana","stop.proxima.size":"Próxima Centauri — {v} años luz","stop.proxima.fact":"Incluso a la velocidad récord de la nave más rápida jamás construida, el viaje dura 6600 años. Y es la estrella más cercana. Más cerca no hay nada.","stop.proxima.short":"La estrella más cercana: 6600 años de viaje","stop.bubble.title":"Nuestra burbuja de radio","stop.bubble.size":"≈ {v} años luz","stop.bubble.fact":"Encendimos la radio hace cien años, y hasta aquí ha llegado. Más allá, el Universo todavía no sabe de nosotros.","stop.bubble.short":"Más allá nadie ha oído hablar de nosotros","stop.galaxy.title":"La Vía Láctea","stop.galaxy.size":"{v} años luz","stop.galaxy.fact":"Cien mil millones de estrellas. O cuatrocientos mil millones: desde dentro no hay manera de contarlas. A una estrella por segundo, son de tres a doce mil años seguidos.","stop.galaxy.short":"Entre 100 000 y 400 000 millones de estrellas","stop.localgroup.title":"El Grupo Local","stop.localgroup.size":"≈ {v} millones de años luz","stop.localgroup.fact":"Andrómeda viene hacia nosotros a 110 km/s. Que choquemos ya no está decidido: los cálculos más recientes lo dejan más o menos en un cincuenta-cincuenta.","stop.localgroup.short":"Andrómeda se acerca. Cincuenta-cincuenta","stop.laniakea.title":"Laniakea","stop.laniakea.size":"{v} millones de años luz","stop.laniakea.fact":"Nuestro supercúmulo. Cien mil galaxias fluyen hacia un mismo punto: el Gran Atractor, que ni siquiera vemos.","stop.laniakea.short":"Algo nos arrastra a todos","stop.universe.title":"El Universo observable","stop.universe.size":"{v} mil millones de años luz","stop.universe.fact":"Más lejos no se puede mirar: no porque no haya nada, sino porque en 13 800 millones de años la luz de allí todavía no ha llegado.","stop.universe.short":"Más allá la luz aún no ha llegado","compare.m1":"Tu ciudad es esa chispa","compare.m2":"La Luna. Tres días de viaje","compare.m3":"La Tierra es ese punto. El Sol, 109 veces más ancho","compare.m4":"Desde aquí el Sol es una estrella más","hero.here":"Este eres tú.","hero.there":"Y esto es todo lo demás.","hero.real":"Ahora, despacio.","report.prologue":"Prólogo (gancho)","report.prologueNote":"salida al borde y vuelta","report.outro":"Final","report.outroNote":"rebobinado a casa","report.decades":"{d} décadas · {s} s/década"},fa=(e,t,o)=>Math.abs(e)===1?t:o,da={"meta.title":"Do ser humano à borda do Universo","meta.desc":"Um zoom logarítmico por 27 ordens de grandeza: da palma da mão ao Universo observável. Distâncias reais, catálogos reais de estrelas e galáxias.","meta.ogTitle":"Do ser humano à borda do Universo","meta.ogDesc":"27 ordens de grandeza em três minutos. Ou o quanto você quiser — controle você mesmo.","loader.title":"Montando o Universo","loader.note":"estrelas, galáxias, vazio","start.h1":"Do ser humano<br />à borda do Universo","start.sub":"27 ordens de grandeza. Distâncias reais.","start.go":"Vamos lá","start.free":"Explorar sozinho","start.foot":"Com som fica muito melhor. Um fone não faz mal.","hud.frameRadius":"raio do quadro","hud.lightTravel":"a luz leva","hud.hint":"roda — zoom · arrastar — girar","ctl.play":"Pausar / continuar","ctl.playAria":"Pausar","ctl.sound":"Som","ctl.mode":"Modo livre","ctl.info":"Sobre o projeto","ctl.lang":"Idioma","ctl.close":"Fechar","about.h2":"O que aqui é real","about.li1":"<b>As distâncias</b> são reais: semieixos maiores das órbitas, paralaxes estelares, desvios para o vermelho das galáxias.","about.li2":"<b>As estrelas</b> vêm do catálogo HYG (Hipparcos + Yale + Gliese): cerca de 118 mil, com coordenadas reais e cores pelo índice B−V.","about.li3":"<b>As galáxias</b> vêm do catálogo 2MRS: 44.599 objetos do Universo próximo.","about.li4":"<b>O tamanho dos planetas</b> está aumentado. Num quadro de duas unidades astronômicas a Terra ocuparia quatro cem-milésimos dele — ou seja, nada. Senão o Sistema Solar seria um círculo preto e vazio.","about.li5":"<b>A cena com a Terra, a Lua e o Sol</b> é encenada: o Sol real, visto da órbita da Terra, é um disco de meio grau, igual à Lua vista da varanda. A direção da luz é honesta; o tamanho e a proximidade, exagerados.","about.li6":"<b>A Via Láctea e a teia cósmica</b> são modelos procedurais com parâmetros publicados: comprimento de escala do disco 2,6 kpc, o Sol a 8,178 kpc do centro, matéria em filamentos e nós, vazio nos buracos.","about.foot":"Feito em WebGL2; o som é sintetizado no navegador em tempo real e amarrado ao logaritmo da escala.","about.sources":"Fontes de dados: {list}","src.stars":"estrelas","src.galaxies":"galáxias","src.procedural":"substituto procedural de {name}","mark.human":"humano","mark.city":"cidade","mark.earth":"Terra","mark.moon":"Lua","mark.au":"1 ua","mark.neptune":"Netuno","mark.ly":"ano-luz","mark.ly90":"90 anos-luz","mark.galaxy":"Galáxia","mark.group":"grupo","mark.laniakea":"Laniakea","mark.all":"tudo","shell.human":"um humano","shell.earth":"a Terra","shell.moon":"a órbita da Lua","shell.inner":"planetas","shell.outer":"cinturão de Kuiper","shell.oort":"nuvem de Oort","shell.stars":"catálogo de estrelas","shell.galaxy":"Via Láctea","shell.group":"Grupo Local","shell.supercluster":"catálogo de galáxias","shell.cosmicweb":"teia cósmica","unit.Gpc":"Gpc","unit.Mpc":"Mpc","unit.ly":"anos-luz","unit.au":"ua","unit.km":"km","unit.m":"m","num.trillion":"{v} tri","num.billion":"{v} bi","num.million":"{v} mi","num.thousand":"{v} mil","time.ns":"{v} ns","time.us":"{v} µs","time.ms":"{v} ms","time.sec":"{v} s","time.minsec":"{m} min {s} s","time.hours":"{v} h","time.days":(e,t)=>`${t(e.v)} ${fa(e.v,"dia","dias")}`,"time.years":"{v} anos","stop.human.title":"Um ser humano","stop.human.size":"{v} m","stop.human.fact":"Os átomos do seu corpo foram montados dentro de estrelas. Tudo, menos o hidrogênio, foi fundido nas entranhas delas e espalhado por explosões.","stop.human.short":"Você é feito de cinza estelar","stop.city.title":"Uma cidade","stop.city.size":"{v} km","stop.city.fact":"É nesta altura que voam os aviões. Mais acima já quase não sobra o que respirar: quatro quintos de todo o ar do planeta ficaram lá embaixo.","stop.city.short":"80% do ar está abaixo desta linha","stop.earth.title":"A Terra","stop.earth.size":"{v} km","stop.earth.fact":"Toda a história da humanidade — tudo o que alguém já sentiu — coube nesta bolinha.","stop.earth.short":"Aqui aconteceu tudo o que você conhece","stop.moon.title":"A órbita da Lua","stop.moon.size":"{v} km","stop.moon.fact":"Na folga entre a Terra e a Lua cabem TODOS os planetas do Sistema Solar. Apertados, mas cabem.","stop.moon.short":"Aqui cabem todos os planetas","stop.sun.title":"O Sol","stop.sun.size":"diâmetro — {v} milhões de km","stop.sun.fact":"Dentro do Sol cabem um milhão e trezentas mil esferas como a nossa Terra. Ali está ela, aliás.","stop.sun.short":"1.300.000 Terras lá dentro","stop.au.title":"A órbita da Terra","stop.au.size":"1 ua = {v} km","stop.au.fact":"A luz do Sol leva 8 minutos e 20 segundos para chegar à Terra. Você nunca viu o Sol — só o passado dele.","stop.au.short":"O Sol que você vê tem oito minutos","stop.outer.title":"O Sistema Solar","stop.outer.size":"até Netuno — {v} ua","stop.outer.fact":"Netuno está a 4,5 bilhões de quilômetros daqui. De carro numa estrada, sem parar — uma viagem de cinco mil anos.","stop.outer.short":"Netuno: 5.000 anos de carro","stop.heliopause.title":"A borda do vento solar","stop.heliopause.size":"≈ {v} ua","stop.heliopause.fact":"A Voyager 1 voa por aqui há 49 anos — a 61.000 quilômetros por hora — e ainda não chegou aos arredores do Sistema Solar.","stop.heliopause.short":"A Voyager voa para cá desde 1977","stop.oort.title":"A nuvem de Oort","stop.oort.size":"≈ {v} anos-luz","stop.oort.fact":"Um trilhão de cometas de gelo paira aqui no escuro. De vez em quando um despenca para dentro, pega fogo na aproximação — e povos inteiros liam nele um presságio.","stop.oort.short":"Um trilhão de cometas esperando a vez","stop.proxima.title":"A estrela mais próxima","stop.proxima.size":"Próxima Centauri — {v} anos-luz","stop.proxima.fact":"Mesmo na velocidade recorde da sonda mais rápida já construída, a viagem leva 6.600 anos. E é a estrela mais próxima. Mais perto não existe.","stop.proxima.short":"A estrela mais próxima: 6.600 anos de viagem","stop.bubble.title":"Nossa bolha de rádio","stop.bubble.size":"≈ {v} anos-luz","stop.bubble.fact":"Ligamos o rádio cem anos atrás — e foi até aqui que ele chegou. Mais além, o Universo ainda não sabe de nós.","stop.bubble.short":"Mais além ninguém ouviu falar de nós","stop.galaxy.title":"A Via Láctea","stop.galaxy.size":"{v} anos-luz","stop.galaxy.fact":"Cem bilhões de estrelas. Ou quatrocentos — de dentro não dá para contar. A uma estrela por segundo, são de três a doze mil anos seguidos.","stop.galaxy.short":"Entre 100 e 400 bilhões de estrelas","stop.localgroup.title":"O Grupo Local","stop.localgroup.size":"≈ {v} milhões de anos-luz","stop.localgroup.fact":"Andrômeda vem na nossa direção a 110 km/s. Se vamos colidir já não está decidido: os cálculos mais recentes dão mais ou menos cinquenta por cento.","stop.localgroup.short":"Andrômeda vem vindo. Cinquenta-cinquenta","stop.laniakea.title":"Laniakea","stop.laniakea.size":"{v} milhões de anos-luz","stop.laniakea.fact":"Nosso superaglomerado. Cem mil galáxias escorrem para um único ponto — o Grande Atrator, que a gente nem consegue ver.","stop.laniakea.short":"Alguma coisa puxa todos nós","stop.universe.title":"O Universo observável","stop.universe.size":"{v} bilhões de anos-luz","stop.universe.fact":"Mais longe não dá para olhar — não porque não haja nada lá, mas porque em 13,8 bilhões de anos a luz de lá ainda não chegou.","stop.universe.short":"Mais além a luz ainda não chegou","compare.m1":"Sua cidade é aquela faísca","compare.m2":"A Lua. Três dias de viagem","compare.m3":"A Terra é aquele ponto. O Sol, 109 vezes mais largo","compare.m4":"Daqui o Sol é só mais uma estrela","hero.here":"Este é você.","hero.there":"E isto é todo o resto.","hero.real":"Agora, de verdade.","report.prologue":"Prólogo (gancho)","report.prologueNote":"saída até a borda e volta","report.outro":"Final","report.outroNote":"rebobinar para casa","report.decades":"{d} décadas · {s} s/década"},ma={"meta.title":"इंसान से ब्रह्मांड के छोर तक","meta.desc":"पैमाने की 27 कोटियों से गुज़रता लघुगणकीय ज़ूम: हथेली से लेकर दृश्य ब्रह्मांड तक। असली दूरियाँ, तारों और आकाशगंगाओं की असली सूचियाँ।","meta.ogTitle":"इंसान से ब्रह्मांड के छोर तक","meta.ogDesc":"तीन मिनट में 27 कोटियाँ। या जितना चाहो — खुद घुमाओ।","loader.title":"ब्रह्मांड जोड़ा जा रहा है","loader.note":"तारे, आकाशगंगाएँ, सन्नाटा","start.h1":"इंसान से<br />ब्रह्मांड के छोर तक","start.sub":"पैमाने की 27 कोटियाँ। असली दूरियाँ।","start.go":"चलो","start.free":"खुद घुमाऊँगा","start.foot":"आवाज़ के साथ कहीं बेहतर। हेडफ़ोन हों तो और अच्छा।","hud.frameRadius":"फ़्रेम त्रिज्या","hud.lightTravel":"रोशनी लेती है","hud.hint":"व्हील — ज़ूम · खींचें — घुमाएँ","ctl.play":"रोकें / जारी रखें","ctl.playAria":"रोकें","ctl.sound":"आवाज़","ctl.mode":"मुक्त मोड","ctl.info":"प्रोजेक्ट के बारे में","ctl.lang":"भाषा","ctl.close":"बंद करें","about.h2":"यहाँ असली क्या है","about.li1":"<b>दूरियाँ</b> असली हैं: कक्षाओं के दीर्घ अर्ध-अक्ष, तारों के लंबन, आकाशगंगाओं का रेडशिफ्ट।","about.li2":"<b>तारे</b> — HYG सूची (Hipparcos + Yale + Gliese) से, करीब 1,18,000 तारे, असली निर्देशांकों और B−V सूचकांक के रंगों के साथ।","about.li3":"<b>आकाशगंगाएँ</b> — 2MRS सूची, नज़दीकी ब्रह्मांड के 44,599 पिंड।","about.li4":"<b>ग्रहों के आकार</b> बढ़ा दिए गए हैं। दो खगोलीय इकाई चौड़े फ़्रेम में पृथ्वी उसका महज़ 0.00004 हिस्सा घेरती है — यानी कुछ भी नहीं। वरना सौरमंडल एक खाली काला घेरा भर दिखता।","about.li5":"<b>पृथ्वी, चंद्रमा और सूरज वाला दृश्य</b> मंचित है: पृथ्वी की कक्षा से असली सूरज आधे डिग्री की चकती भर है, जैसे बालकनी से चंद्रमा। रोशनी की दिशा ईमानदार है; आकार और नज़दीकी बढ़ा-चढ़ाकर दिखाई गई है।","about.li6":"<b>आकाशगंगा और ब्रह्मांडीय जाल</b> — प्रकाशित मापदंडों पर बने प्रक्रियात्मक मॉडल: डिस्क की स्केल लंबाई 2.6 kpc, केंद्र से सूरज 8.178 kpc दूर, पदार्थ तंतुओं और गाँठों में, खालीपन शून्यों में।","about.foot":"WebGL2 पर बना; आवाज़ ब्राउज़र में रियल टाइम में बनती है और पैमाने के लघुगणक से बँधी है।","about.sources":"डेटा स्रोत: {list}","src.stars":"तारे","src.galaxies":"आकाशगंगाएँ","src.procedural":"{name} की प्रक्रियात्मक जगह","mark.human":"इंसान","mark.city":"शहर","mark.earth":"पृथ्वी","mark.moon":"चंद्रमा","mark.au":"1 AU","mark.neptune":"नेपच्यून","mark.ly":"प्रकाश वर्ष","mark.ly90":"90 प्र. वर्ष","mark.galaxy":"आकाशगंगा","mark.group":"समूह","mark.laniakea":"लानियाकेआ","mark.all":"सब कुछ","shell.human":"इंसान","shell.earth":"पृथ्वी","shell.moon":"चंद्रमा की कक्षा","shell.inner":"ग्रह","shell.outer":"कुइपर बेल्ट","shell.oort":"ऊर्ट बादल","shell.stars":"तारों की सूची","shell.galaxy":"आकाशगंगा","shell.group":"स्थानीय समूह","shell.supercluster":"आकाशगंगाओं की सूची","shell.cosmicweb":"ब्रह्मांडीय जाल","unit.Gpc":"Gpc","unit.Mpc":"Mpc","unit.ly":"प्रकाश वर्ष","unit.au":"AU","unit.km":"किमी","unit.m":"मी","num.trillion":"{v} ट्रिलियन","num.billion":"{v} अरब","num.million":"{v} मिलियन","num.thousand":"{v} हज़ार","time.ns":"{v} ns","time.us":"{v} µs","time.ms":"{v} ms","time.sec":"{v} सेकंड","time.minsec":"{m} मिनट {s} सेकंड","time.hours":"{v} घंटे","time.days":"{v} दिन","time.years":"{v} साल","stop.human.title":"इंसान","stop.human.size":"{v} मी","stop.human.fact":"तुम्हारे शरीर के परमाणु तारों के भीतर जुड़े थे। हाइड्रोजन को छोड़कर सब कुछ तारों की भट्ठी में ढला और विस्फोटों ने बिखेर दिया।","stop.human.short":"तुम तारों की राख से बने हो","stop.city.title":"शहर","stop.city.size":"{v} किमी","stop.city.fact":"इसी ऊँचाई पर हवाई जहाज़ उड़ते हैं। इससे ऊपर साँस लेने को लगभग कुछ नहीं बचता: ग्रह की चार-पाँचवीं हवा नीचे रह गई।","stop.city.short":"हवा का 80 % इस रेखा से नीचे","stop.earth.title":"पृथ्वी","stop.earth.size":"{v} किमी","stop.earth.fact":"इंसानियत का पूरा इतिहास — जो कुछ भी किसी ने कभी महसूस किया — इसी छोटी-सी गेंद पर समा गया।","stop.earth.short":"जो कुछ तुम जानते हो, सब यहीं हुआ","stop.moon.title":"चंद्रमा की कक्षा","stop.moon.size":"{v} किमी","stop.moon.fact":"पृथ्वी और चंद्रमा के बीच की इस खाली जगह में सौरमंडल के सारे ग्रह समा जाते हैं। बस किसी तरह, पर समा जाते हैं।","stop.moon.short":"यहाँ सारे ग्रह समा जाते हैं","stop.sun.title":"सूर्य","stop.sun.size":"व्यास — {v} मिलियन किमी","stop.sun.fact":"सूर्य के भीतर हमारी पृथ्वी जैसे तेरह लाख गोले समा सकते हैं। और वह रही पृथ्वी, वैसे।","stop.sun.short":"भीतर 13 लाख पृथ्वियाँ","stop.au.title":"पृथ्वी की कक्षा","stop.au.size":"1 AU = {v} किमी","stop.au.fact":"सूरज की रोशनी को पृथ्वी तक आने में 8 मिनट 20 सेकंड लगते हैं। तुमने सूरज कभी देखा ही नहीं — सिर्फ़ उसका अतीत देखा है।","stop.au.short":"जो सूरज तुम देखते हो, वह आठ मिनट पुराना है","stop.outer.title":"सौरमंडल","stop.outer.size":"नेपच्यून तक — {v} AU","stop.outer.fact":"नेपच्यून यहाँ से 4.5 अरब किलोमीटर दूर है। हाईवे पर कार से, बिना रुके — पाँच हज़ार साल का सफ़र।","stop.outer.short":"नेपच्यून: कार से 5,000 साल","stop.heliopause.title":"सौर पवन का किनारा","stop.heliopause.size":"≈ {v} AU","stop.heliopause.fact":"«वॉयेजर-1» 49 साल से यहाँ उड़ रहा है — 61,000 किलोमीटर प्रति घंटे की रफ़्तार से — और अब तक सौरमंडल के बाहरी छोर तक भी नहीं पहुँचा।","stop.heliopause.short":"वॉयेजर 1977 से यहाँ की ओर उड़ रहा है","stop.oort.title":"ऊर्ट बादल","stop.oort.size":"≈ {v} प्रकाश वर्ष","stop.oort.fact":"एक ट्रिलियन बर्फ़ीले धूमकेतु यहाँ अँधेरे में लटके हैं। कभी-कभार कोई एक नीचे गिरता है, पास आते-आते दहक उठता है — और पूरी-पूरी कौमों ने उसमें शगुन पढ़ा।","stop.oort.short":"एक ट्रिलियन धूमकेतु अपनी बारी के इंतज़ार में","stop.proxima.title":"सबसे नज़दीकी तारा","stop.proxima.size":"प्रॉक्सिमा सेंटॉरी — {v} प्रकाश वर्ष","stop.proxima.fact":"इंसान के सबसे तेज़ यान की रिकॉर्ड रफ़्तार से भी वहाँ पहुँचने में 6,600 साल लगेंगे। और यह सबसे नज़दीकी तारा है। इससे पास कुछ नहीं।","stop.proxima.short":"सबसे नज़दीकी तारा: 6,600 साल का सफ़र","stop.bubble.title":"हमारा रेडियो बुलबुला","stop.bubble.size":"≈ {v} प्रकाश वर्ष","stop.bubble.fact":"रेडियो सौ साल पहले चालू हुआ था — और बस यहाँ तक पहुँचा है। इसके आगे ब्रह्मांड को हमारा पता ही नहीं।","stop.bubble.short":"इसके आगे हमारे बारे में किसी ने नहीं सुना","stop.galaxy.title":"आकाशगंगा","stop.galaxy.size":"{v} प्रकाश वर्ष","stop.galaxy.fact":"सौ अरब तारे। या चार सौ अरब — भीतर से गिनना नामुमकिन है। एक सेकंड में एक तारा गिनो, तो तीन से बारह हज़ार साल लगातार लगेंगे।","stop.galaxy.short":"100 से 400 अरब तारे","stop.localgroup.title":"स्थानीय समूह","stop.localgroup.size":"≈ {v} मिलियन प्रकाश वर्ष","stop.localgroup.fact":"एंड्रोमेडा 110 किमी/से की रफ़्तार से हमारी ओर आ रही है। टक्कर होगी या नहीं, अब तय नहीं: ताज़ा गणनाएँ इसे लगभग पचास-पचास बताती हैं।","stop.localgroup.short":"एंड्रोमेडा आ रही है। पचास-पचास","stop.laniakea.title":"लानियाकेआ","stop.laniakea.size":"{v} मिलियन प्रकाश वर्ष","stop.laniakea.fact":"हमारा महागुच्छ। एक लाख आकाशगंगाएँ एक ही बिंदु की ओर बह रही हैं — उस महाआकर्षक की ओर, जो हमें दिखता तक नहीं।","stop.laniakea.short":"कोई चीज़ हम सबको खींच रही है","stop.universe.title":"दृश्य ब्रह्मांड","stop.universe.size":"{v} अरब प्रकाश वर्ष","stop.universe.fact":"इससे आगे देखा नहीं जा सकता — इसलिए नहीं कि वहाँ कुछ है ही नहीं, बल्कि इसलिए कि 13.8 अरब साल में भी वहाँ की रोशनी हम तक नहीं पहुँच पाई।","stop.universe.short":"इसके आगे से रोशनी अभी पहुँची ही नहीं","compare.m1":"तुम्हारा शहर — यही चिंगारी","compare.m2":"चंद्रमा। तीन दिन का रास्ता","compare.m3":"पृथ्वी — यह बिंदु। सूरज 109 गुना चौड़ा","compare.m4":"यहाँ से सूरज बस एक और तारा है","hero.here":"यह — तुम हो।","hero.there":"और यह — बाक़ी सब कुछ।","hero.real":"अब — असल में।","report.prologue":"प्रस्तावना (हुक)","report.prologueNote":"छोर तक और वापस","report.outro":"समापन","report.outroNote":"घर तक रिवाइंड","report.decades":"{d} कोटियाँ · {s} से/कोटि"},wo=e=>Math.round(e*10)/10,ns=(e,t)=>e>=100?`${t(wo(e/100))}亿光年`:`${t(Math.round(e*100))}万光年`,va={"meta.title":"从一个人到宇宙尽头","meta.desc":"一次跨越27个数量级的对数缩放：从你的手掌到可观测宇宙。真实的距离，真实的恒星与星系目录。","meta.ogTitle":"从一个人到宇宙尽头","meta.ogDesc":"三分钟穿越27个数量级。也可以不限时——自己动手转转看。","loader.title":"正在组装宇宙","loader.note":"恒星、星系、虚空","start.h1":"从一个人<br />到宇宙尽头","start.sub":"27个数量级。真实的距离。","start.go":"出发","start.free":"我自己来","start.foot":"开着声音效果更好。最好戴上耳机。","hud.frameRadius":"画面半径","hud.lightTravel":"光需要","hud.hint":"滚轮——缩放 · 拖动——旋转","ctl.play":"暂停 / 继续","ctl.playAria":"暂停","ctl.sound":"声音","ctl.mode":"自由模式","ctl.info":"关于","ctl.lang":"语言","ctl.close":"关闭","about.h2":"这里什么是真实的","about.li1":"<b>距离</b>是真实的：轨道半长轴、恒星视差、星系红移。","about.li2":"<b>恒星</b>来自HYG目录（依巴谷 + 耶鲁 + 格利泽）——约11.8万颗，坐标真实，颜色由B−V色指数换算。","about.li3":"<b>星系</b>来自2MRS目录：44 599个近域宇宙天体。","about.li4":"<b>行星的大小</b>被放大了。在两个天文单位宽的画面里，地球只占十万分之四——等于什么都看不见。不放大的话，太阳系就是一个空荡荡的黑圈。","about.li5":"<b>地球、月球与太阳同框的镜头</b>是摆拍：真实的太阳从地球轨道看只是半度宽的圆盘，和你阳台上看到的月亮一样大。光的方向是诚实的；大小和远近不是。","about.li6":"<b>银河系和宇宙网</b>是按公开参数构建的程序化模型：盘标长2.6千秒差距，太阳距银心8.178千秒差距，物质聚成纤维和节点，空洞里空无一物。","about.foot":"基于WebGL2构建；声音由浏览器实时合成，与缩放的对数值绑定。","about.sources":"数据来源：{list}","src.stars":"恒星","src.galaxies":"星系","src.procedural":"{name}的程序化替身","mark.human":"人","mark.city":"城市","mark.earth":"地球","mark.moon":"月球","mark.au":"1 AU","mark.neptune":"海王星","mark.ly":"光年","mark.ly90":"90光年","mark.galaxy":"银河系","mark.group":"星系群","mark.laniakea":"拉尼亚凯亚","mark.all":"一切","shell.human":"人","shell.earth":"地球","shell.moon":"月球轨道","shell.inner":"行星","shell.outer":"柯伊伯带","shell.oort":"奥尔特云","shell.stars":"恒星目录","shell.galaxy":"银河系","shell.group":"本星系群","shell.supercluster":"星系目录","shell.cosmicweb":"宇宙网","unit.Gpc":"Gpc","unit.Mpc":"Mpc","unit.ly":"光年","unit.au":"AU","unit.km":"公里","unit.m":"米","num.trillion":(e,t)=>`${t(wo(e.v))}万亿`,"num.billion":(e,t)=>`${t(wo(e.v*10))}亿`,"num.million":(e,t)=>`${t(Math.round(e.v*100))}万`,"num.thousand":(e,t)=>`${t(Math.round(e.v*1e3))}`,"time.ns":"{v} 纳秒","time.us":"{v} 微秒","time.ms":"{v} 毫秒","time.sec":"{v} 秒","time.minsec":"{m} 分 {s} 秒","time.hours":"{v} 小时","time.days":"{v} 天","time.years":"{v} 年","stop.human.title":"人","stop.human.size":"{v} 米","stop.human.fact":"你身体里的原子是在恒星内部组装出来的。除了氢，一切都在恒星核心里熔炼过，又被爆炸抛洒出来。","stop.human.short":"你是恒星的灰烬做的","stop.city.title":"城市","stop.city.size":"{v} 公里","stop.city.fact":"客机就在这个高度飞行。再往上几乎没有空气可呼吸：地球五分之四的空气都在你脚下了。","stop.city.short":"80%的空气在这条线以下","stop.earth.title":"地球","stop.earth.size":"{v} 公里","stop.earth.fact":"人类的全部历史——所有人曾感受过的一切——都装在这颗小球上。","stop.earth.short":"你知道的一切都发生在这里","stop.moon.title":"月球轨道","stop.moon.size":"{v} 公里","stop.moon.fact":"太阳系所有行星都能塞进地球和月球之间的空隙。刚刚好——但塞得下。","stop.moon.short":"所有行星都塞得进来","stop.sun.title":"太阳","stop.sun.size":(e,t)=>`直径——${t(Math.round(e.v*100))}万公里`,"stop.sun.fact":"太阳内部能装下130万个我们这样的地球。顺便说一句——它就在那儿。","stop.sun.short":"里面装得下130万个地球","stop.au.title":"地球轨道","stop.au.size":"1 AU = {v} 公里","stop.au.fact":"阳光要走8分20秒才能到达地球。你从未见过太阳——只见过它的过去。","stop.au.short":"你看到的是八分钟前的太阳","stop.outer.title":"太阳系","stop.outer.size":"到海王星——{v} AU","stop.outer.fact":"海王星在45亿公里之外。开车走高速、不眠不休——要开五千年。","stop.outer.short":"到海王星：开车五千年","stop.heliopause.title":"太阳风的边界","stop.heliopause.size":"≈ {v} AU","stop.heliopause.fact":"旅行者1号在这里飞了49年——时速六万一千公里——仍然没有走出太阳系的外围。","stop.heliopause.short":"旅行者号从1977年飞到现在","stop.oort.title":"奥尔特云","stop.oort.size":"≈ {v} 光年","stop.oort.fact":"一万亿颗冰冷的彗星悬在这里的黑暗中。偶尔有一颗坠向内侧，在途中亮起——曾有整个民族把它读作天象预兆。","stop.oort.short":"一万亿颗彗星在排队","stop.proxima.title":"最近的恒星","stop.proxima.size":"比邻星——{v} 光年","stop.proxima.fact":"就算乘上人类造过的最快飞行器，到这里也要飞6600年。而这已经是最近的恒星。没有更近的了。","stop.proxima.short":"最近的恒星：6600年航程","stop.bubble.title":"我们的无线电泡","stop.bubble.size":"≈ {v} 光年","stop.bubble.fact":"人类打开无线电是一百年前的事——它就传到了这里。再往外，宇宙还没听说过我们。","stop.bubble.short":"这之外没人听说过我们","stop.galaxy.title":"银河系","stop.galaxy.size":"{v} 光年","stop.galaxy.fact":"一千亿颗恒星。也可能是四千亿——身在其中数不清。每秒数一颗，要连续数三千到一万两千年。","stop.galaxy.short":"一千亿到四千亿颗恒星","stop.localgroup.title":"本星系群","stop.localgroup.size":(e,t)=>`≈ ${ns(e.v,t)}`,"stop.localgroup.fact":"仙女座星系正以每秒110公里朝我们扑来。撞不撞得上已经不好说了：最新的计算大约是五五开。","stop.localgroup.short":"仙女座来了。五五开","stop.laniakea.title":"拉尼亚凯亚","stop.laniakea.size":(e,t)=>ns(e.v,t),"stop.laniakea.fact":"我们的超星系团。十万个星系正流向同一个点——巨引源。而我们甚至看不见它。","stop.laniakea.short":"有什么东西在拖着我们所有人","stop.universe.title":"可观测宇宙","stop.universe.size":(e,t)=>`${t(Math.round(e.v*10))}亿光年`,"stop.universe.fact":"再远就看不到了——不是因为那里空无一物，而是138亿年里，那里的光还来不及抵达。","stop.universe.short":"这之外的光还没飞到","compare.m1":"你的城市就是那点火花","compare.m2":"月球。三天的路程","compare.m3":"地球是那个点。太阳比它宽109倍","compare.m4":"从这里看，太阳只是又一颗星星","hero.here":"这就是你。","hero.there":"而这是其余的一切。","hero.real":"现在——慢慢来。","report.prologue":"序幕（钩子）","report.prologueNote":"冲到边缘再回来","report.outro":"尾声","report.outroNote":"倒带回家","report.decades":"{d} 个数量级 · 每级 {s} 秒"},Fe=["ru","en","es","pt","hi","zh"],ds={ru:"RU",en:"EN",es:"ES",pt:"PT",hi:"हि",zh:"中文"},ba={ru:Mo,en:Ce,es:pa,pt:da,hi:ma,zh:va},ga={ru:"ru-RU",en:"en-US",es:"es-ES",pt:"pt-BR",hi:"hi-IN",zh:"zh-CN"},ms=new Set(["ru","uk","be","kk","ky","uz","tg","tk","hy","az"]),vs="uz.lang";function Oe(e){if(!e)return null;const t=String(e).toLowerCase().split(/[-_]/)[0];return Fe.includes(t)?t:ms.has(t)?"ru":null}function ya(){const e=typeof navigator>"u"?null:navigator,t=e?e.languages&&e.languages.length?e.languages:e.language?[e.language]:[]:[];for(const o of t){const s=String(o).toLowerCase().split(/[-_]/)[0];if(ms.has(s))return"ru";if(s==="es"||s==="pt"||s==="hi"||s==="en")return s}return"en"}const Uo=typeof location<"u"&&typeof document<"u",Ue=Uo?new URLSearchParams(location.search):null,Io=!!(Ue&&Ue.has("capture"));function xa(){if(!Uo)return"ru";const e=Oe(Ue.get("lang"));if(Io)return e||"ru";if(e)return e;try{const t=Oe(localStorage.getItem(vs));if(t)return t}catch{}return ya()}let xt=xa();const zo=new Set;Uo&&!Io&&Oe(Ue.get("lang"))&&bs(xt);function bs(e){try{localStorage.setItem(vs,e)}catch{}}function Ve(){return xt}function Ma(e,t={}){const o=Oe(e);if(!o||o===xt)return xt;xt=o,Ao.clear(),t.persist!==!1&&!Io&&bs(xt);for(const s of[...zo])s(xt);return xt}function gs(e){return zo.add(e),()=>zo.delete(e)}function wa(){return Fe[(Fe.indexOf(xt)+1)%Fe.length]}const Ao=new Map;function Pt(e,t){const o=xt+"|"+(t?JSON.stringify(t):"");let s=Ao.get(o);return s||(s=new Intl.NumberFormat(ga[xt],t),Ao.set(o,s)),s.format(e)}function ve(e,t){return Pt(e,{minimumFractionDigits:t,maximumFractionDigits:t})}function za(e){const t=ba[xt];if(t&&e in t)return t[e];if(Ce!==t&&e in Ce)return Ce[e];if(e in Mo)return Mo[e]}function Aa(e,t){return e.replace(/\{(\w+)\}/g,(o,s)=>{if(!(s in t))return o;const a=t[s];return typeof a=="number"?Pt(a):String(a)})}function X(e,t){const o=za(e);return typeof o=="function"?o(t||{},Pt):typeof o!="string"?e:t?Aa(o,t):o}const be=149597870700,ka=9460730472580800,Ie=0x6da012f95c9e88,ge=1e6*Ie,Sa=299792458,Yt=-.3,wt=26.95;function pt(e,t,o,s){return{id:e,r:t,hold:o,nums:s,get title(){return X(`stop.${e}.title`)},get size(){return X(`stop.${e}.size`,s)},get fact(){return X(`stop.${e}.fact`)},get factShort(){return X(`stop.${e}.short`)}}}const Ot=[pt("human",1.7,6.5,{v:1.7}),pt("city",12e3,7,{v:12}),pt("earth",12742e3,5,{v:12742}),pt("moon",77e7,6.5,{v:384400}),pt("sun",71e8,8.5,{v:1.39}),pt("au",32e10,6,{v:149597871}),pt("outer",96e11,6.5,{v:30}),pt("heliopause",4e13,7.5,{v:120}),pt("oort",3e16,6.5,{v:1.6}),pt("proxima",12e16,7.5,{v:4.25}),pt("bubble",2e18,5.5,{v:105}),pt("galaxy",1e21,8,{v:1e5}),pt("localgroup",1e23,8,{v:10}),pt("laniakea",5e24,6.5,{v:520}),pt("universe",88e25,10,{v:93})],ko=[{id:"human",lo:-.3,hi:4.2,core:[-.3,3.4],unit:1},{id:"earth",lo:3.4,hi:8.2,core:[4.2,7.4],unit:1e4},{id:"moon",lo:7.4,hi:10.2,core:[8.2,9.4],unit:1e6},{id:"inner",lo:9.4,hi:12.6,core:[10.2,11.8],unit:be},{id:"outer",lo:11.8,hi:14.6,core:[12.6,13.8],unit:be},{id:"oort",lo:13.8,hi:17.2,core:[14.6,16.4],unit:be},{id:"stars",lo:16.4,hi:19.8,core:[17.2,19],unit:Ie},{id:"galaxy",lo:19,hi:22.2,core:[19.8,21.4],unit:1e3*Ie},{id:"group",lo:21.4,hi:23.9,core:[22.2,23.1],unit:ge},{id:"supercluster",lo:23.1,hi:25.6,core:[23.9,24.8],unit:ge},{id:"cosmicweb",lo:24.8,hi:27.2,core:[25.6,27.2],unit:1e3*ge}];function Ta(e,t){const[o,s]=e.core;return t>=o&&t<=s?1:t<o?t<=e.lo?0:at(e.lo,o,t):t>=e.hi?0:1-at(s,e.hi,t)}function at(e,t,o){const s=Math.min(1,Math.max(0,(o-e)/(t-e)));return s*s*(3-2*s)}function Go(e){const t=[];let o=0;for(const s of ko){const a=Ta(s,e);a>.001&&(t.push({shell:s,w:a}),o+=a)}if(o>0)for(const s of t)s.w/=o;return t}const eo=[{at:1e24,div:1e3*ge,key:"unit.Gpc",dec:2},{at:1e22,div:ge,key:"unit.Mpc",dec:0},{at:1e17,div:ka,key:"unit.ly",dec:0},{at:1e12,div:be,key:"unit.au",dec:0},{at:1e5,div:1e3,key:"unit.km",dec:0},{at:0,div:1,key:"unit.m",dec:1}];function Ra(e){const t=eo.find(a=>e>=a.at)||eo[eo.length-1],o=e/t.div;let s;return o>=1e4?s=ys(o):o>=100?s=Pt(Math.round(o)):s=ve(o,t.dec===0?1:t.dec),`${s} ${X(t.key)}`}function ys(e){const t=[[1e12,"num.trillion"],[1e9,"num.billion"],[1e6,"num.million"],[1e3,"num.thousand"]];for(const[o,s]of t)if(e>=o){const a=e/o;return X(s,{v:ve(a,a>=100?0:1)})}return Pt(Math.round(e))}function Ea(e){const t=e/Sa;if(t<1e-6)return X("time.ns",{v:Pt(Math.round(t*1e9))});if(t<.001)return X("time.us",{v:Pt(Math.round(t*1e6))});if(t<1)return X("time.ms",{v:Pt(Math.round(t*1e3))});if(t<90)return X("time.sec",{v:ve(t,1)});if(t<5400){const s=Math.floor(t/60),a=Math.round(t-s*60);return X("time.minsec",{m:s,s:a})}if(t<86400*2)return X("time.hours",{v:ve(t/3600,1)});if(t<86400*700)return X("time.days",{v:Math.round(t/86400)});const o=t/31557600;return o<1e3?X("time.years",{v:ve(o,o<10?1:0)}):X("time.years",{v:ys(o)})}const is=42*Math.PI/180,Pa=[[-.3,.15],[7.1,.18],[11.5,.22],[14.6,.25],[17.5,.24],[19,.3],[20,.66],[21,.95],[21.8,.86],[23,.5],[24.5,.42],[27.2,.46]];function _a(e,t){if(t<=e[0][0])return e[0][1];const o=e[e.length-1];if(t>=o[0])return o[1];for(let s=1;s<e.length;s++){const[a,n]=e[s];if(t<=a){const[r,i]=e[s-1];return i+(n-i)*g(r,a,t)}}return o[1]}function Ba(e){return _a(Pa,e)}class Ca{constructor(){this.L=.23,this.aspect=16/9,this.yaw=0,this.pitch=.18,this.roll=0,this._proj=to(),this._view=to(),this._vp=to()}get radius(){return Math.pow(10,this.L)}drift(t,o=this.L){const s=Ba(o),a=v(.1,.045,g(.3,.9,s)),n=v(1,.55,g(.35,.9,s));this.yaw=n*(.3*Math.sin(t*.041)+.14*Math.sin(t*.113+1.7)),this.pitch=s+a*Math.sin(t*.033+.5),this.roll=.035*Math.sin(t*.027+2.1)}matricesFor(t){const o=this.radius/t.unit,s=o/Math.tan(is/2),a=Math.cos(this.yaw),n=Math.sin(this.yaw),r=Math.cos(this.pitch),i=Math.sin(this.pitch),c=[s*r*n,s*i,s*r*a],l=s*.001,u=s*1e3;Qs(this._proj,is,this.aspect,l,u);const h=[Math.sin(this.roll),Math.cos(this.roll),0];return Zs(this._view,c,[0,0,0],h),Js(this._vp,this._proj,this._view),{vp:this._vp,eye:c,viewR:o,dist:s,near:l,far:u}}}class Fa{constructor(t,o,{min:s=-.3,max:a=26.95}={}){this.cam=t,this.el=o,this.min=s,this.max=a,this.targetL=t.L,this.velocity=0,this.enabled=!1,this.userYaw=0,this.userPitch=0,this._drag=null,o.addEventListener("wheel",this._onWheel,{passive:!1}),o.addEventListener("pointerdown",this._onDown),window.addEventListener("pointermove",this._onMove),window.addEventListener("pointerup",this._onUp),window.addEventListener("keydown",this._onKey),this._touch={d0:0,L0:0},o.addEventListener("touchstart",this._onTouchStart,{passive:!1}),o.addEventListener("touchmove",this._onTouchMove,{passive:!1})}_onWheel=t=>{if(!this.enabled)return;t.preventDefault();const o=t.deltaMode===1?16:t.deltaMode===2?400:1;this.targetL+=t.deltaY*o*.0016,this.targetL=Math.min(this.max,Math.max(this.min,this.targetL))};_onDown=t=>{this.enabled&&(this._drag={x:t.clientX,y:t.clientY,yaw:this.userYaw,pitch:this.userPitch})};_onMove=t=>{this._drag&&(this.userYaw=this._drag.yaw+(t.clientX-this._drag.x)*.004,this.userPitch=Math.max(-1.2,Math.min(1.2,this._drag.pitch+(t.clientY-this._drag.y)*.004)))};_onUp=()=>{this._drag=null};_onKey=t=>{this.enabled&&((t.key==="ArrowUp"||t.key==="+"||t.key==="=")&&(this.targetL-=.25),(t.key==="ArrowDown"||t.key==="-")&&(this.targetL+=.25),this.targetL=Math.min(this.max,Math.max(this.min,this.targetL)))};_onTouchStart=t=>{!this.enabled||t.touches.length!==2||(t.preventDefault(),this._touch.d0=Math.hypot(t.touches[0].clientX-t.touches[1].clientX,t.touches[0].clientY-t.touches[1].clientY),this._touch.L0=this.targetL)};_onTouchMove=t=>{if(!this.enabled||t.touches.length!==2||!this._touch.d0)return;t.preventDefault();const o=Math.hypot(t.touches[0].clientX-t.touches[1].clientX,t.touches[0].clientY-t.touches[1].clientY);this.targetL=Math.min(this.max,Math.max(this.min,this._touch.L0-Math.log10(o/this._touch.d0)*2.2))};update(t){const o=this.cam.L,s=1-Math.exp(-t*6);return this.cam.L=v(this.cam.L,this.targetL,s),this.velocity=(this.cam.L-o)/Math.max(1e-4,t),this.velocity}syncFrom(t){this.targetL=t,this.cam.L=t}dispose(){this.el.removeEventListener("wheel",this._onWheel),this.el.removeEventListener("pointerdown",this._onDown),window.removeEventListener("pointermove",this._onMove),window.removeEventListener("pointerup",this._onUp),window.removeEventListener("keydown",this._onKey),this.el.removeEventListener("touchstart",this._onTouchStart),this.el.removeEventListener("touchmove",this._onTouchMove)}}const La=`
float pointProfile(vec2 uv, float spikes){
  float r = length(uv);
  if(r > 1.0) return 0.0;
  float core  = exp(-r * r * 26.0);
  float halo  = exp(-r * 6.2) * 0.17;
  float skirt = exp(-r * 2.3) * 0.045;
  float d = 0.0;
  if(spikes > 0.0){
    vec2 a = abs(uv);
    float h = exp(-a.y * 52.0) * exp(-a.x * 3.6);
    float v = exp(-a.x * 52.0) * exp(-a.y * 3.6);
    vec2 d45 = abs(vec2(uv.x + uv.y, uv.x - uv.y) * 0.7071);
    float s1 = exp(-d45.y * 66.0) * exp(-d45.x * 4.4);
    float s2 = exp(-d45.x * 66.0) * exp(-d45.y * 4.4);
    d = (h + v) * 0.45 + (s1 + s2) * 0.15;
    d *= spikes;
  }
  float edge = smoothstep(1.0, 0.78, r);
  return (core + halo + skirt + d) * edge;
}`,Oa=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec4 aColorMag; // rgb + величина (0..255 → яркость)

uniform mat4 uVP;
uniform vec3 uEye;
uniform float uPixelScale;   // высота вьюпорта в пикселях / 2
uniform float uSizeBase;     // базовый размер точки, пиксели
uniform float uSizeGain;     // насколько размер растёт с яркостью
uniform float uBrightness;
uniform float uDistFade;     // 1 = яркость падает как 1/r², 0 = не падает
uniform float uNear;
uniform float uTime;
uniform float uTwinkle;

out vec3 vColor;
out float vAlpha;
out float vSpikes;
out float vPx; // фактический размер спрайта в пикселях — профиль зависит от него

void main(){
  vec4 clip = uVP * vec4(aPos, 1.0);
  gl_Position = clip;

  float mag = aColorMag.a;            // 0..1, уже нормировано
  float lum = pow(mag, 2.2);

  float d = length(aPos - uEye);
  float fade = mix(1.0, 1.0 / (1.0 + d * d * 0.0), uDistFade);

  // Размер в пикселях: яркие звёзды крупнее, но не линейно — иначе кашица
  float size = uSizeBase * (1.0 + uSizeGain * lum);
  // Спрайт меньше ~2 px на настоящем GPU почти невидим: центр точки падает в
  // произвольную субпиксельную позицию, и острый профиль в FS отбрасывает
  // большую часть таких фрагментов (SwiftShader ставит центр ровно и прощал —
  // отсюда «чёрная Ланиакея» только на железе). Держим минимум 2 px, а
  // энергию компенсируем альфой: суммарный свет точки не меняется.
  float pxSize = clamp(size, 2.0, 220.0);
  gl_PointSize = pxSize;
  vPx = pxSize;
  float cover = min(1.0, (size * size) / (pxSize * pxSize));

  float tw = 1.0;
  if(uTwinkle > 0.0){
    // мерцание с индивидуальной фазой, привязанной к позиции
    float ph = dot(aPos, vec3(12.9898, 78.233, 37.719));
    tw = 1.0 + uTwinkle * 0.35 * sin(uTime * 2.7 + ph);
  }

  vColor = aColorMag.rgb;
  vAlpha = lum * uBrightness * fade * tw * cover;
  vSpikes = smoothstep(0.55, 0.95, mag);

  if(clip.w <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // за спиной — выкинуть
}`,Ua=`#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
in float vSpikes;
in float vPx;
out vec4 o;
uniform float uOpacity;   // вес оболочки при кроссфейде
uniform float uSpikeAmt;
${La}
void main(){
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float a;
  if (vPx < 3.5) {
    // МЕЛКИЕ СПРАЙТЫ — плоский диск. Аналитический профиль здесь бесполезен:
    // у 2-пиксельной точки все фрагменты сидят на r≈0,7, где exp(-r²·22)
    // уже ноль. SwiftShader маскировал это, ставя центр 1px-точки ровно в
    // середину пикселя; настоящие GPU кладут его куда попало — и целые
    // тусклые каталоги (Ланиакея!) исчезали. Плоский диск стабилен на любом
    // железе; 0,33 подобрано так, чтобы суммарный свет совпадал с прежним
    // видом на мягком растеризаторе.
    float rr = length(uv);
    a = (0.33 + 0.22 * exp(-rr * rr * 2.0)) * smoothstep(1.0, 0.75, rr);
  } else {
    a = pointProfile(uv, vSpikes * uSpikeAmt);
  }
  if(a <= 0.0) discard;
  o = vec4(vColor * a * vAlpha * uOpacity, 1.0);
}`;class G{constructor(t,o,s={}){this.gl=t,this.count=o.pos.length/3,this.opts={sizeBase:1.6,sizeGain:7,brightness:1,distFade:0,twinkle:0,spikes:1,additive:!0,...s},G._prog||(G._prog=vt(t,Oa,Ua,"points")),this.prog=G._prog,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=bt(t,o.pos),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.bufCol=bt(t,o.color),t.bindBuffer(t.ARRAY_BUFFER,this.bufCol),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.UNSIGNED_BYTE,!0,0,0),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null)}draw(t,o,s,a={}){if(o<=.002||this.count===0)return;const n=this.gl,r={...this.opts,...a},i=this.prog;n.useProgram(i.p),n.bindVertexArray(this.vao),n.enable(n.BLEND),r.blend==="dust"?n.blendFunc(n.ZERO,n.ONE_MINUS_SRC_COLOR):n.blendFunc(n.ONE,n.ONE),n.depthMask(!1),n.uniformMatrix4fv(i.u.uVP,!1,t.vp),n.uniform3fv(i.u.uEye,t.eye),n.uniform1f(i.u.uSizeBase,r.sizeBase*(t.pixelScale||1)),n.uniform1f(i.u.uSizeGain,r.sizeGain),n.uniform1f(i.u.uBrightness,r.brightness),n.uniform1f(i.u.uDistFade,r.distFade),n.uniform1f(i.u.uTime,s),n.uniform1f(i.u.uTwinkle,r.twinkle),n.uniform1f(i.u.uOpacity,o),n.uniform1f(i.u.uSpikeAmt,r.spikes);const c=r.count!==void 0?Math.min(r.count,this.count):this.count;n.drawArrays(n.POINTS,r.first||0,c),n.depthMask(!0),n.disable(n.BLEND),n.bindVertexArray(null)}dispose(){const t=this.gl;t.deleteVertexArray(this.vao),t.deleteBuffer(this.bufPos),t.deleteBuffer(this.bufCol)}}function D(e){const t=e.length,o=new Float32Array(t*3),s=new Uint8Array(t*4);for(let a=0;a<t;a++){const n=e[a];o[a*3]=n.x,o[a*3+1]=n.y,o[a*3+2]=n.z,s[a*4]=Math.round(Math.min(1,Math.max(0,n.r))*255),s[a*4+1]=Math.round(Math.min(1,Math.max(0,n.g))*255),s[a*4+2]=Math.round(Math.min(1,Math.max(0,n.b))*255),s[a*4+3]=Math.round(Math.min(1,Math.max(0,n.mag))*255)}return{pos:o,color:s}}const Ia=`#version 300 es
precision highp float;
uniform mat4 uVP;
uniform vec3 uCenter;
uniform float uRadius, uQuad;
uniform vec3 uRight, uUp;
out vec2 vUv;
out vec3 vWorld;
void main(){
  // TRIANGLE_STRIP из 4 вершин: 0→(-1,-1) 1→(1,-1) 2→(-1,1) 3→(1,1)
  vec2 c = vec2(float(gl_VertexID & 1), float((gl_VertexID >> 1) & 1)) * 2.0 - 1.0;
  vUv = c;
  // Полуразмер квада считает CPU: он обязан накрыть весь силуэт тела, а тот
  // с приближением камеры раздувается до полусферы (см. Body.draw)
  vec3 wp = uCenter + (uRight * c.x + uUp * c.y) * uQuad;
  vWorld = wp;
  gl_Position = uVP * vec4(wp, 1.0);
}`,Ga=`#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vWorld;
out vec4 o;

uniform vec3 uCenter, uEye, uSunDir, uBaseColor;
uniform float uRadius, uOpacity, uTime, uSeed, uSpin, uTilt;
uniform int uType;      // 0 каменистая, 1 газовый гигант, 2 звезда, 3 луна, 4 Земля
uniform float uAtmo;    // толщина атмосферы, доли радиуса
uniform vec3 uAtmoColor;
uniform float uRingInner, uRingOuter; // кольца Сатурна, 0 = нет
uniform float uCoronaK; // вес короны звезды: мала при маленьком диске
uniform mat4 uVP;
${Oo}

vec3 sphereNormal(vec3 ro, vec3 rd, out float t, out bool hit){
  vec3 oc = ro - uCenter;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - uRadius * uRadius;
  float d = b * b - c;
  hit = d > 0.0;
  if(!hit){ t = 0.0; return vec3(0.0); }
  t = -b - sqrt(d);
  vec3 p = ro + rd * t;
  return normalize(p - uCenter);
}

// Вращаем нормаль вокруг оси Y — планеты крутятся, это видно на остановках.
// uTilt наклоняет ось: в ближней оболочке точка под камерой — ровно +Y, и без
// наклона вся видимая шапка приходится на полюс (сплошной лёд, ноль фактуры).
// По умолчанию 0 — для всех прежних вызовов поведение не меняется.
vec3 spun(vec3 n){
  float ct = cos(uTilt), st = sin(uTilt);
  n = vec3(n.x, ct * n.y - st * n.z, st * n.y + ct * n.z);
  float a = uSpin;
  float ca = cos(a), sa = sin(a);
  return vec3(ca * n.x - sa * n.z, n.y, sa * n.x + ca * n.z);
}

/** Высота камеры над поверхностью в долях радиуса: 0 — у самой земли. */
float altNorm(){
  return length(uEye - uCenter) / max(uRadius, 1e-6) - 1.0;
}

vec3 surface(vec3 n){
  vec3 sn = spun(n);          // широта считается по НАКЛОНЁННОЙ нормали
  vec3 p = sn * 3.0 + uSeed;
  if(uType == 1){ // газовый гигант: полосы + завихрения
    float bands = sin(sn.y * 11.0 + fbm(p * 1.6, 4) * 3.4);
    float storm = fbm(p * 4.0 + vec3(0.0, uTime * 0.02, 0.0), 5);
    vec3 c = mix(uBaseColor * 0.55, uBaseColor * 1.35, bands * 0.5 + 0.5);
    c = mix(c, vec3(1.0, 0.86, 0.72) * uBaseColor, smoothstep(0.62, 0.85, storm) * 0.55);
    return c;
  }
  if(uType == 4){ // Земля: океан, континенты, облака, ночные огни
    float land = fbm(p * 1.15, 6);
    float m = smoothstep(0.50, 0.56, land);
    vec3 ocean = vec3(0.016, 0.055, 0.15);
    vec3 green = mix(vec3(0.09, 0.16, 0.06), vec3(0.30, 0.26, 0.14), fbm(p * 6.0, 4));
    vec3 ice = vec3(0.85, 0.90, 0.95);
    vec3 c = mix(ocean, green, m);
    c = mix(c, ice, smoothstep(0.72, 0.93, abs(sn.y)));
    float cloud = smoothstep(0.52, 0.72, fbm(p * 2.1 + vec3(uTime * 0.006, 0.0, 0.0), 5));
    // С низкой орбиты циклоны размером с континент уходят за горизонт, и кадр
    // остаётся гладким. Досыпаем мелкую кучёвку — она и даёт ощущение высоты.
    float dn = 1.0 - smoothstep(0.05, 0.50, altNorm());
    if(dn > 0.01){
      float fine = smoothstep(0.54, 0.80, fbm(p * 13.0 + vec3(uTime * 0.02, 0.0, 0.0), 4));
      cloud = max(cloud, fine * dn);
    }
    c = mix(c, vec3(0.95), cloud * 0.72);
    return c;
  }
  if(uType == 3){ // луна: моря и кратеры
    // Моря нарочно на низкой частоте: на диске в десяток пикселей кратеры
    // усредняются в ровную заливку, и только крупные тёмные пятна ещё читаются.
    float mare = smoothstep(0.43, 0.57, fbm(p * 1.5, 4));
    float cr = fbm(p * 5.0, 5);
    float pits = smoothstep(0.55, 0.72, fbm(p * 12.0, 3));
    return uBaseColor * (0.62 + 0.42 * cr - pits * 0.20) * mix(1.0, 0.64, mare);
  }
  // каменистая
  float h = fbm(p * 2.2, 6);
  return uBaseColor * (0.6 + 0.7 * h);
}

/**
 * ВЫХОД ШЕЙДЕРА — ПРЕМУЛЬТИПЛИРОВАННЫЙ.
 *
 * o.rgb — свет, который тело ДОБАВЛЯЕТ в кадр (уже умноженный на покрытие),
 * o.a   — сколько тело ЗАСЛОНЯЕТ то, что за ним.
 * Смешивание: ONE, ONE_MINUS_SRC_ALPHA.
 *
 * Это разделение и есть суть фикса: свечение атмосферы за силуэтом — чистый
 * СВЕТ, оно отдаётся с alpha = 0 и физически не может ничего затемнить.
 * Раньше эта ветка возвращала маленькую, но НЕнулевую альфу по всей площади
 * билборда, и поверх яркого фона (гало Солнца) весь квад проступал тёмной
 * рамкой. Заслоняет теперь только настоящий силуэт: alpha = 1.
 *
 * Побочно чинится и двойное умножение на прозрачность: при старом
 * SRC_ALPHA цвет тела уходил в кадр как col·uOpacity², то есть на
 * кроссфейде оболочек тело было темнее, чем должно быть.
 */
void main(){
  vec3 rd = normalize(vWorld - uEye);
  float t; bool hit;
  vec3 n = sphereNormal(uEye, rd, t, hit);

  vec3 col = vec3(0.0);   // свет тела до умножения на покрытие
  float alpha = 0.0;      // покрытие: 1 — силуэт, 0 — только свет

  if(uType == 2){ // ЗВЕЗДА: диск + лимбовое потемнение + корона
    vec3 toC = uCenter - uEye;
    float dist = length(toC);
    vec3 dir = toC / dist;
    float cosA = dot(rd, dir);
    float ang = acos(clamp(cosA, -1.0, 1.0));
    float angR = asin(clamp(uRadius / dist, 0.0, 1.0));
    float r = ang / max(angR, 1e-9);

    float disk = 1.0 - smoothstep(0.985, 1.0, r);
    float limb = sqrt(max(0.0, 1.0 - r * r * 0.98));
    float gran = fbm(normalize(rd - dir * cosA) * 26.0 + uTime * 0.05, 4);
    // Лимбовое потемнение НАСТОЯЩЕЕ, с запасом: при слабом (0.68) и яркости
    // диска в разы выше единицы ACES давил и центр, и край в один белый —
    // большое солнце выглядело плоской плитой. Край должен уходить под 1.0,
    // тогда у диска появляются золотой обод и объём.
    vec3 photo = uBaseColor * (0.85 + 0.35 * gran) * mix(0.26, 1.0, limb);

    float corona = exp(-(r - 1.0) * 3.4) * step(1.0, r);
    corona += exp(-(r - 1.0) * 0.9) * 0.22 * step(1.0, r);
    float ray = 0.5 + 0.5 * sin(atan(rd.y, rd.x) * 9.0 + fbm(rd * 8.0, 3) * 6.0);
    corona *= 0.7 + 0.6 * ray;

    // Окно: корона обязана дойти до нуля РАНЬШЕ края билборда, иначе её хвост
    // обрезается прямой кромкой и звезда выглядит квадратной. Окно КРУГЛОЕ —
    // раньше здесь стояло max(|u|,|v|), то есть квадрат, и на большом гало
    // Солнца проступал ровно он: изофоты короны шли по квадрату, углы
    // срезались, и на круглом ореоле читался квадратный контур.
    // Окно с ранним стартом: на кваде 3,4R корона без него доживает до таких
    // яркостей, что ACES плющит её в плоский блин с ободом. Мягкое гало
    // вокруг звезды рисует Glow-спрайт оболочки — короне достаточно узкой зоны.
    float edge = length(vUv);
    corona *= 1.0 - smoothstep(0.35, 0.85, edge);

    // Корона писалась для крупных планов. На диске в пару десятков пикселей
    // она вся попадает в верх ACES и рисует плоскую белёсую плиту размером с
    // квад — мягкое гало вокруг маленького солнца отдаёт Glow-спрайт оболочки,
    // а короне здесь положен лишь слабый ободок.
    corona *= uCoronaK;

    // Яркость фотосферы тоже привязана к размеру диска. HDR-значение 9 на
    // маленьком диске — это не «яркая точка», а гигантский плоский ореол
    // блума размером с пол-экрана: пирамида размазывает пересвет на сотни
    // пикселей независимо от размера источника. Крупному солнцу — полные 9.
    col = photo * disk * 2.8 + uBaseColor * corona * 1.2;
    // Фотосфера непрозрачна, корона — чистый свет. Заслонять здесь нечего:
    // звезда всегда самый дальний объект своей оболочки, и лишняя альфа
    // только вычитала бы фон. Отдаём alpha = 0 — премультиплированный аддитив.
    if(max(disk, min(1.0, corona)) < 0.002) discard;
    o = vec4(col * uOpacity, 0.0);
    return;
  }

  if(hit && t > 0.0){
    vec3 alb = surface(n);

    // БЛИЖНИЙ ПЛАН. Издалека процедурной фактуры хватает, но у поверхности
    // видимая шапка сжимается до нескольких градусов, весь разброс шума
    // уходит за горизонт — и шар вырождается в ровную плиту. Досыпаем два
    // слоя мелкой фактуры на ФИКСИРОВАННЫХ частотах: переменная частота
    // морфила бы рисунок прямо на зуме, а это заметнее любой плиты.
    float altN = length(uEye - uCenter) / max(uRadius, 1e-6) - 1.0;
    float d1 = 1.0 - smoothstep(0.07, 0.60, altN);
    if(d1 > 0.004){
      vec3 q = spun(n) * 3.0 + uSeed;
      alb *= mix(1.0, 0.60 + 0.82 * fbm(q * 8.0, 5), d1 * 0.85);
      float d2 = 1.0 - smoothstep(0.010, 0.11, altN);
      if(d2 > 0.004) alb *= mix(1.0, 0.62 + 0.78 * fbm(q * 52.0, 4), d2 * 0.75);
    }

    float ndl = max(0.0, dot(n, uSunDir));
    // мягкий терминатор: у настоящих планет край тени не бритвенный
    float lit = smoothstep(-0.08, 0.22, dot(n, uSunDir));
    vec3 amb = alb * 0.020;
    col = alb * (ndl * 1.15) * lit + amb;

    if(uType == 4){ // ночная сторона: огни городов
      float night = smoothstep(0.12, -0.05, dot(n, uSunDir));
      float land = smoothstep(0.50, 0.56, fbm(spun(n) * 3.0 * 1.15 + uSeed, 6));
      float lights = smoothstep(0.62, 0.85, fbm(spun(n) * 24.0 + uSeed, 4)) * land;
      col += vec3(1.0, 0.72, 0.36) * lights * night * 0.35;
    }
    alpha = 1.0;

    // Рэлеевский ободок на лимбе
    if(uAtmo > 0.0){
      float rim = pow(1.0 - max(0.0, dot(n, -rd)), 3.0);
      col += uAtmoColor * rim * (0.4 + 0.9 * max(0.0, dot(n, uSunDir)));
    }
  } else if(uAtmo > 0.0){
    // Свечение атмосферы за силуэтом
    vec3 toC = uCenter - uEye;
    float dist = length(toC);
    vec3 dir = toC / dist;
    float ang = acos(clamp(dot(rd, dir), -1.0, 1.0));
    float angR = asin(clamp(uRadius / dist, 0.0, 1.0));
    float r = ang / max(angR, 1e-9);
    // max(r-1, 0) вместо step(1, r): у самого лимба квадратное уравнение и
    // угловая оценка расходятся на float-эпсилон, и в пикселях, где луч уже
    // «не попал», а r ещё меньше единицы, step пробивал в кайме чёрные дырки.
    // step(uRadius, dist) — страховка: изнутри сферы атмосферу не рисуем вовсе.
    float glow = exp(-max(r - 1.0, 0.0) / max(uAtmo, 1e-4)) * step(uRadius, dist);
    float sunSide = 0.35 + 0.65 * max(0.0, dot(normalize(rd - dir * dot(rd, dir)), uSunDir));
    col = uAtmoColor * glow * 1.5 * sunSide;
    // Воздух не заслоняет — он светит. alpha остаётся нулём, и хвост свечения
    // по всей площади билборда больше не вычитает фон.
    alpha = 0.0;
  }

  // Премультиплированный выход: rgb — добавленный свет, a — заслонение.
  // Порог по обеим величинам: у ветки свечения alpha честно равна нулю,
  // и старый тест по одной альфе выбросил бы её целиком.
  vec3 emit = col * uOpacity;
  float cover = alpha * uOpacity;
  if(max(cover, max(emit.r, max(emit.g, emit.b))) < 0.002) discard;
  o = vec4(emit, cover);
}`;let oo=null;class It{constructor(t,o){this.gl=t,this.cfg={type:0,baseColor:[.6,.6,.6],atmo:0,atmoColor:[.35,.55,1],seed:0,spinRate:.05,tilt:0,...o},oo||(oo=vt(t,Ia,Ga,"body")),this.prog=oo}draw(t,o,s,a,n,r=[1,0,0]){if(a<=.003)return;const i=this.gl,c=this.prog;i.useProgram(c.p);const l=[o[0]-t.eye[0],o[1]-t.eye[1],o[2]-t.eye[2]],u=Math.hypot(l[0],l[1],l[2])||1;l[0]/=u,l[1]/=u,l[2]/=u;let h=Math.abs(l[1])>.95?[0,0,1]:[0,1,0];const p=[l[1]*h[2]-l[2]*h[1],l[2]*h[0]-l[0]*h[2],l[0]*h[1]-l[1]*h[0]],d=Math.hypot(p[0],p[1],p[2])||1;p[0]/=d,p[1]/=d,p[2]/=d;const f=[p[1]*l[2]-p[2]*l[1],p[2]*l[0]-p[0]*l[2],p[0]*l[1]-p[1]*l[0]],m=Math.min(.9995,s/Math.max(u,s*1.0001)),b=Math.min(1.45,Math.asin(m)*(this.cfg.type===2?3.4:1.9));if(this.cfg.type!==2&&t.viewportH&&t.dist&&t.viewR&&s*(t.viewportH*.5)*(t.dist/t.viewR)/u<1.5)return;i.uniformMatrix4fv(c.u.uVP,!1,t.vp),i.uniform3fv(c.u.uCenter,o),i.uniform3fv(c.u.uEye,t.eye),i.uniform3fv(c.u.uRight,p),i.uniform3fv(c.u.uUp,f),i.uniform1f(c.u.uRadius,s),i.uniform1f(c.u.uQuad,u*Math.tan(b));const y=s*((t.viewportH||720)*.5)/Math.max(t.viewR||s,1e-12);i.uniform1f(c.u.uCoronaK,Math.min(1,Math.max(.12,(y-25)/85))),i.uniform1f(c.u.uOpacity,a),i.uniform1f(c.u.uTime,n),i.uniform1f(c.u.uSeed,this.cfg.seed),i.uniform1f(c.u.uSpin,n*this.cfg.spinRate),i.uniform1f(c.u.uTilt,this.cfg.tilt),i.uniform1i(c.u.uType,this.cfg.type),i.uniform1f(c.u.uAtmo,this.cfg.atmo),i.uniform3fv(c.u.uAtmoColor,this.cfg.atmoColor),i.uniform3fv(c.u.uBaseColor,this.cfg.baseColor),i.uniform3fv(c.u.uSunDir,r),i.enable(i.BLEND),i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA),i.depthMask(this.cfg.type!==2),i.drawArrays(i.TRIANGLE_STRIP,0,4),i.depthMask(!0),i.disable(i.BLEND)}}const No=6371e3,Na=1737400,Te=3844e5,So=.28,Da=330,xs=76,$=Math.PI*2;function me(e,t){if(t<=e[0][0])return e[0][1];const o=e[e.length-1];if(t>=o[0])return o[1];for(let s=1;s<e.length;s++){const[a,n]=e[s];if(t<=a){const[r,i]=e[s-1];return i+(n-i)*g(r,a,t)}}return o[1]}function Do(e){const t=e.vp,o=Math.hypot(t[0],t[4],t[8])||1,s=Math.hypot(t[1],t[5],t[9])||1,a=Math.hypot(t[3],t[7],t[11])||1;return{R:[t[0]/o,t[4]/o,t[8]/o],U:[t[1]/s,t[5]/s,t[9]/s],F:[t[3]/a,t[7]/a,t[11]/a],aspect:s/o}}function Ms(e,t,o,s){const{R:a,U:n,aspect:r}=Do(e),i=o*e.viewR*r,c=s*e.viewR,l=a[0]*i+n[0]*c,u=a[1]*i+n[1]*c,h=a[2]*i+n[2]*c,p=e.vp,d=t.m;for(let m=0;m<12;m++)d[m]=p[m];for(let m=0;m<4;m++)d[12+m]=p[m]*l+p[4+m]*u+p[8+m]*h+p[12+m];const f=t.cam;return f.vp=d,f.eye=t.eye,f.eye[0]=e.eye[0]-l,f.eye[1]=e.eye[1]-u,f.eye[2]=e.eye[2]-h,f.viewR=e.viewR,f.dist=e.dist,f.near=e.near,f.far=e.far,f.pixelScale=e.pixelScale,f.viewportW=e.viewportW,f.viewportH=e.viewportH,f}function ws(){return{m:new Float32Array(16),eye:[0,0,0],cam:{}}}const ae={x:1.18,y:1.25},rs={x:-.17,y:.1};function zs(e){return g(9.12,9.42,e)*(1-g(9.9,10.3,e))}const qa=1.05;function Va(e,t){const o=Do(e),s=e.dist>0?e.viewR/e.dist:.3839,a=ae.x*t*s*o.aspect,n=ae.y*t*s,r=o.F[0]+o.R[0]*a+o.U[0]*n,i=o.F[1]+o.R[1]*a+o.U[1]*n,c=o.F[2]+o.R[2]*a+o.U[2]*n,l=Math.hypot(r,i,c)||1,u=qa*(e.dist||1),h=e.eye[0]+r/l*u,p=e.eye[1]+i/l*u,d=e.eye[2]+c/l*u,f=Math.hypot(h,p,d)||1;return[h/f,p/f,d/f]}const Ha=`#version 300 es
precision highp float;
uniform mat4 uVP;
uniform vec3 uCenter, uRight, uUp;
uniform float uRadius;
out vec2 vUv;
void main(){
  vec2 c = vec2(float(gl_VertexID & 1), float((gl_VertexID >> 1) & 1)) * 2.0 - 1.0;
  vUv = c;
  vec3 wp = uCenter + (uRight * c.x + uUp * c.y) * uRadius;
  gl_Position = uVP * vec4(wp, 1.0);
}`,Wa=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform vec3 uColor;
uniform float uCore, uFall, uIntensity, uFlat;
// Кольцо-метка: тонкая окружность внутри того же квада. Нужна ровно в одном
// месте — на метке города (М1), но заводить ради неё отдельный примитив
// дороже, чем один exp в шейдере, который при uRing = 0 стоит ноль.
uniform float uRing, uRingR, uRingW;
void main(){
  float r = length(vUv);
  if(r > 1.0) discard;
  float core = exp(-r * r * uCore);
  float halo = pow(max(0.0, 1.0 - r), uFall);
  float a = (core * (1.0 - uFlat) + halo * mix(0.45, 1.0, uFlat)) * smoothstep(1.0, 0.72, r);
  if(uRing > 0.0){
    float d = (r - uRingR) / max(uRingW, 1e-4);
    a += uRing * exp(-d * d);
  }
  o = vec4(uColor * a * uIntensity, 1.0);
}`;let so=null,qo=class{constructor(t){this.gl=t,so||(so=vt(t,Ha,Wa,"glow")),this.prog=so}draw(t,o,s,a,n,{core:r=6,fall:i=3,flat:c=0,ring:l=0,ringR:u=.62,ringW:h=.09}={}){if(n<=.002||s<=0)return;const p=this.gl,d=this.prog;p.useProgram(d.p);const f=[o[0]-t.eye[0],o[1]-t.eye[1],o[2]-t.eye[2]],m=Math.hypot(f[0],f[1],f[2])||1;f[0]/=m,f[1]/=m,f[2]/=m;const b=Math.abs(f[1])>.95?[0,0,1]:[0,1,0],y=[f[1]*b[2]-f[2]*b[1],f[2]*b[0]-f[0]*b[2],f[0]*b[1]-f[1]*b[0]],x=Math.hypot(y[0],y[1],y[2])||1;y[0]/=x,y[1]/=x,y[2]/=x;const A=[y[1]*f[2]-y[2]*f[1],y[2]*f[0]-y[0]*f[2],y[0]*f[1]-y[1]*f[0]];p.uniformMatrix4fv(d.u.uVP,!1,t.vp),p.uniform3fv(d.u.uCenter,o),p.uniform3fv(d.u.uRight,y),p.uniform3fv(d.u.uUp,A),p.uniform3fv(d.u.uColor,a),p.uniform1f(d.u.uRadius,s),p.uniform1f(d.u.uIntensity,n),p.uniform1f(d.u.uCore,r),p.uniform1f(d.u.uFall,i),p.uniform1f(d.u.uFlat,c),p.uniform1f(d.u.uRing,l),p.uniform1f(d.u.uRingR,u),p.uniform1f(d.u.uRingW,h),p.enable(p.BLEND),p.blendFunc(p.ONE,p.ONE),p.depthMask(!1),p.drawArrays(p.TRIANGLE_STRIP,0,4),p.depthMask(!0),p.disable(p.BLEND)}};const Ya=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aNormal;
layout(location = 1) in vec4 aColorMag;
uniform mat4 uVP;
uniform vec3 uEye, uSun, uCenter;
uniform float uRadius, uSize, uGain, uBright;
out vec3 vColor;
out float vAlpha;
void main(){
  vec3 n = normalize(aNormal);
  vec3 wp = uCenter + n * uRadius;
  vec4 clip = uVP * vec4(wp, 1.0);
  gl_Position = clip;

  float lum = pow(aColorMag.a, 2.0);
  vec3 toEye = normalize(uEye - wp);
  float night = smoothstep(0.12, -0.14, dot(n, uSun)); // терминатор мягкий
  float vis = smoothstep(0.0, 0.34, dot(n, toEye));    // у лимба огни гаснут
  gl_PointSize = clamp(uSize * (1.0 + uGain * lum), 1.0, 32.0);
  vColor = aColorMag.rgb;
  vAlpha = lum * uBright * night * vis;
  if(clip.w <= 0.0 || vAlpha <= 0.0005) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,$a=`#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
out vec4 o;
uniform float uOpacity;
void main(){
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r = length(uv);
  if(r > 1.0) discard;
  float a = (exp(-r * r * 20.0) + exp(-r * 5.0) * 0.16) * smoothstep(1.0, 0.75, r);
  o = vec4(vColor * a * vAlpha * uOpacity, 1.0);
}`;let ao=null;class no{constructor(t,o,s={}){this.gl=t,this.count=o.pos.length/3,this.opts={size:1.2,gain:2.4,brightness:1,...s},ao||(ao=vt(t,Ya,$a,"surface-lights")),this.prog=ao,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.bufferData(t.ARRAY_BUFFER,o.pos,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.bufCol=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.bufCol),t.bufferData(t.ARRAY_BUFFER,o.color,t.STATIC_DRAW),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.UNSIGNED_BYTE,!0,0,0),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null)}draw(t,o,s,a,n,r={}){if(n<=.002)return;const i=this.gl,c={...this.opts,...r},l=this.prog;i.useProgram(l.p),i.bindVertexArray(this.vao),i.uniformMatrix4fv(l.u.uVP,!1,t.vp),i.uniform3fv(l.u.uEye,t.eye),i.uniform3fv(l.u.uSun,a),i.uniform3fv(l.u.uCenter,o),i.uniform1f(l.u.uRadius,s),i.uniform1f(l.u.uSize,c.size*(t.pixelScale||1)),i.uniform1f(l.u.uGain,c.gain),i.uniform1f(l.u.uBright,c.brightness),i.uniform1f(l.u.uOpacity,n),i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),i.disable(i.DEPTH_TEST),i.depthMask(!1),i.drawArrays(i.POINTS,0,this.count),i.depthMask(!0),i.enable(i.DEPTH_TEST),i.disable(i.BLEND),i.bindVertexArray(null)}}const ja=`#version 300 es
precision highp float;
uniform mat4 uVP;
uniform float uA, uB, uSinI, uCosI, uPhase, uSegs;
out float vT;
void main(){
  float f = float(gl_VertexID) / uSegs;
  float th = f * 6.28318530718;
  vec3 p = vec3(cos(th) * uA, sin(th) * uB * uSinI, sin(th) * uB * uCosI);
  vT = fract(f - uPhase + 1.0);   // 0 — у тела, 1 — на полный круг позади
  gl_Position = uVP * vec4(p, 1.0);
}`,Ka=`#version 300 es
precision highp float;
in float vT;
out vec4 o;
uniform vec3 uColor, uHeadColor;
uniform float uOpacity, uBase, uHead;
void main(){
  float tail = pow(clamp(1.0 - vT, 0.0, 1.0), 7.0);
  vec3 c = mix(uColor, uHeadColor, tail);
  o = vec4(c * (uBase + uHead * tail) * uOpacity, 1.0);
}`;let io=null,Xa=class{constructor(t,{a:o,b:s=o,inc:a=0,segments:n=640}={}){this.gl=t,this.a=o,this.b=s,this.inc=a,this.segs=n,io||(io=vt(t,ja,Ka,"orbit-trail")),this.prog=io}draw(t,o,s,{color:a=[.3,.44,.72],head:n=[.62,.8,1],base:r=.18,headAmt:i=1}={}){if(s<=.003)return;const c=this.gl,l=this.prog;c.useProgram(l.p),c.bindVertexArray(null),c.uniformMatrix4fv(l.u.uVP,!1,t.vp),c.uniform1f(l.u.uA,this.a),c.uniform1f(l.u.uB,this.b),c.uniform1f(l.u.uSinI,Math.sin(this.inc)),c.uniform1f(l.u.uCosI,Math.cos(this.inc)),c.uniform1f(l.u.uPhase,o-Math.floor(o)),c.uniform1f(l.u.uSegs,this.segs),c.uniform3fv(l.u.uColor,a),c.uniform3fv(l.u.uHeadColor,n),c.uniform1f(l.u.uOpacity,s),c.uniform1f(l.u.uBase,r),c.uniform1f(l.u.uHead,i),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE),c.depthMask(!1),c.drawArrays(c.LINE_STRIP,0,this.segs+1),c.depthMask(!0),c.disable(c.BLEND)}};const Qa=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;   // единичная коробка: x,z ∈ [-1,1], y ∈ [0,1]
layout(location = 1) in vec3 aNrm;
layout(location = 2) in vec2 aUv;
layout(location = 3) in vec4 aI0;    // x, z, полуширина, полуглубина (м)
layout(location = 4) in vec4 aI1;    // высота (м), поворот, сид, тип+даунтаунность

uniform mat4 uVP;
uniform vec3 uEye;
uniform float uHGain;  // постановочный рост высоток, см. draw()

out vec3 vNrm;
out vec2 vFace;   // метры: вдоль фасада и вверх
out vec2 vUv01;
out float vDist;
// flat: эти четыре постоянны в пределах инстанса, и интерполировать их незачем.
// Для типа это ещё и вопрос корректности — из него floor() достаёт вид
// застройки, и любая интерполяционная погрешность сменила бы дом на ангар.
flat out float vH;
flat out float vSeed;
flat out float vKind;
flat out float vFaceId;

void main(){
  float hx = aI0.z, hz = aI0.w;
  float H = aI1.x, a = aI1.y;
  // Постановочный рост: тянем ТОЛЬКО высотки и только на тех масштабах, где
  // отдельный дом уже неразличим. Малоэтажка остаётся на месте, поэтому
  // видно не «вырос дом», а «даунтаун поднялся над кварталами» — то самое,
  // чем силуэт Манхэттена отличается от ковра огней. Пятно тянем следом, но
  // втрое слабее: башня в полпикселя мерцает на дрейфе камеры.
  float tall = smoothstep(45.0, 150.0, H);
  H *= 1.0 + (uHGain - 1.0) * tall;
  float wg = 1.0 + (uHGain - 1.0) * 0.42 * tall;
  hx *= wg; hz *= wg;
  float ca = cos(a), sa = sin(a);

  vec3 lp = vec3(aPos.x * hx, aPos.y * H, aPos.z * hz);
  vec2 xz = vec2(ca * lp.x - sa * lp.z, sa * lp.x + ca * lp.z) + aI0.xy;
  gl_Position = uVP * vec4(xz.x, lp.y, xz.y, 1.0);
  vDist = length(vec3(xz.x, lp.y, xz.y) - uEye);

  vec2 n2 = vec2(ca * aNrm.x - sa * aNrm.z, sa * aNrm.x + ca * aNrm.z);
  vNrm = vec3(n2.x, aNrm.y, n2.y);

  // Ширина фасада в метрах: у граней ±X это глубина дома, у ±Z — ширина.
  // Сетку окон задаём в МЕТРАХ, а не в долях грани: иначе на узком доме окна
  // становятся узкими, и масштаб города плывёт от здания к зданию.
  float w = mix(2.0 * hx, 2.0 * hz, step(0.5, abs(aNrm.x)));
  vFace = (aNrm.y > 0.5)
    ? vec2(aUv.x * 2.0 * hx, aUv.y * 2.0 * hz)
    : vec2(aUv.x * w, aUv.y * H);

  vUv01 = aUv;
  vH = H;
  vSeed = aI1.z;
  vKind = aI1.w;
  vFaceId = aNrm.x * 3.0 + aNrm.z * 11.0; // 4 стены — 4 разных рисунка окон
}`,Za=`#version 300 es
precision highp float;
in vec3 vNrm;
in vec2 vFace;
in vec2 vUv01;
in float vDist;
flat in float vH;
flat in float vSeed;
flat in float vKind;
flat in float vFaceId;
out vec4 o;

uniform float uOpacity, uBright, uTime, uFogD, uTowerGain;

float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p, float s){
  vec3 q = fract(vec3(p.x, p.y, s) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return fract((q.x + q.y) * q.z);
}

void main(){
  // В целой части типа лежит вид застройки, в дробной — «даунтаунность»
  // участка. Отдельного атрибута ради одного числа заводить не за что, а
  // знать её нужно: разгонять на дальних планах надо ЦЕНТР, а не каждую
  // случайную свечку в спальном районе.
  float kind = floor(vKind);
  float core = vKind - kind;
  float office = step(0.5, kind) * step(kind, 1.5); // башня
  float podium = step(1.5, kind) * step(kind, 2.5); // стилобат башни
  float shed   = step(2.5, kind);                   // ангар промзоны

  // ВОЗДУШНАЯ ПЕРСПЕКТИВА. Камера смотрит под 10°, и город уходит до
  // горизонта: без затухания дальние кварталы складываются в ровную кремовую
  // стену поперёк кадра, которая забивает и глубину, и передний план.
  // Дальность привязана к дистанции камеры — иначе на каждой декаде свой туман.
  float fog = exp(-vDist / uFogD);

  if (vNrm.y > 0.5) {
    // КРЫША. Почти чёрная, и это принципиально: под наклоном камеры крыши
    // занимают половину площади города, и любая их светлота немедленно
    // превращает мегаполис в поле серого картона.
    vec3 c = vec3(0.0044, 0.0049, 0.0072);
    vec2 rg = vFace / 7.0;
    vec2 rc = floor(rg);
    float r = h21(rc, vSeed + 5.0);
    float lamp = smoothstep(0.15, 0.03, length(rg - rc - 0.5));
    c += vec3(0.72, 0.72, 0.68) * step(0.905, r) * lamp * (0.06 + 0.16 * h11(r * 91.0));
    if (shed > 0.5) c += vec3(0.74, 0.82, 1.0) * step(0.80, r) * lamp * 0.16;
    // ПАРАПЕТ. Сверху под небольшим углом видны в основном крыши, а крыша
    // чёрная — квартал под ногами проваливается в пустоту. Край крыши всегда
    // подсвечен снизу улицей, и эта светлая рамка — главный признак объёма
    // при взгляде сверху: вместо чёрного поля получается сетка контуров.
    // Дальше, где рамка тоньше пикселя, гасим её: иначе по городу ползёт муар.
    vec2 e2 = min(vUv01, 1.0 - vUv01);
    float edge = 1.0 - smoothstep(0.0, 0.035, min(e2.x, e2.y));
    float big = smoothstep(0.055, 0.014, max(fwidth(vUv01.x), fwidth(vUv01.y)));
    c += vec3(1.0, 0.60, 0.28) * edge * big * 0.070;
    if (vH > 75.0) {
      float bl = 0.30 + 0.70 * pow(0.5 + 0.5 * sin(uTime * 2.3 + vSeed * 41.0), 3.0);
      c += vec3(1.0, 0.13, 0.06) * bl * smoothstep(0.085, 0.0, length(vUv01 - 0.5)) * 1.1;
    }
    o = vec4(c * uBright * uOpacity * fog, 1.0);
    return;
  }

  // ФАСАД. Этаж и шаг окон — в метрах: 3,6 м на жилой этаж, 3,9 на офисный.
  float WY = mix(3.6, 3.9, office);
  float WX = mix(3.2, 3.7, office);
  if (shed > 0.5) { WX = 6.0; WY = 4.5; }
  float base = mix(1.6, 3.2, office); // цоколь без окон

  vec2 g = vec2(vFace.x / WX, (vFace.y - base) / WY);
  // ДАЛЬНИЙ ПОРЯДОК. Когда окно мельче пикселя, честная сетка даёт муар и
  // кипящий шум на пролёте. Меряем размер ячейки в пикселях через fwidth и
  // плавно подменяем рисунок его средним — дом тускнеет ровно, без мельтешения.
  vec2 fw = fwidth(g);
  float lod = clamp(max(fw.x, fw.y) * 1.8 - 0.5, 0.0, 1.0);

  vec2 cell = floor(g);
  vec2 f = g - cell;
  float wq = smoothstep(0.16, 0.26, f.x) * smoothstep(0.84, 0.74, f.x)
           * smoothstep(0.18, 0.30, f.y) * smoothstep(0.86, 0.76, f.y);
  wq *= step(0.0, g.y) * step(vFace.y, vH - 0.6);

  float rw = h21(cell + vec2(vFaceId * 23.0, 0.0), vSeed);
  float rf = h11(cell.y * 7.13 + vSeed * 53.0 + vFaceId * 1.7);
  float sleepy = mix(1.0, 0.45, step(0.62, h11(vSeed * 17.0 + 2.0))); // часть домов спит
  float pLit = (mix(0.30, 0.50, office) + 0.20 * podium - 0.16 * shed) * sleepy;
  pLit += 0.30 * step(0.87, rf) * (1.0 - shed); // дежурные этажи горят целиком
  float lit = step(rw, pLit);
  float br = 0.24 + 0.85 * h11(rw * 137.0 + 1.7);

  float cw = h11(rw * 311.0 + vSeed * 3.3);
  vec3 warm = vec3(1.0, 0.66 + 0.14 * cw, 0.27 + 0.21 * cw);
  vec3 cold = vec3(0.70 + 0.16 * cw, 0.82 + 0.10 * cw, 1.0);
  float coldP = mix(0.16, 0.52, office) + 0.30 * shed;
  vec3 wc = mix(warm, cold, step(cw, coldP));

  // Средний тон дальнего дома держим заметно теплее отдельных окон: холодные
  // окна в сумме дают белёсый бетон, а ночной город издали всегда янтарный
  float meanE = 0.125 * pLit;
  float cw0 = h11(vSeed * 7.7 + 0.3);
  vec3 meanC = mix(vec3(1.0, 0.62 + 0.10 * cw0, 0.25 + 0.16 * cw0), vec3(0.72, 0.83, 1.0), coldP * 0.55);

  vec3 c = mix(wc, meanC, lod) * mix(wq * lit * br, meanE, lod) * 0.70;
  // Уличные огни подсвечивают низ фасада — граница «дом стоит на земле».
  // Держим коротким: длинный градиент заливает половину фасада кремовым и
  // съедает всю сетку окон.
  c += vec3(1.0, 0.52, 0.20) * 0.038 * exp(-vFace.y / 8.5) * (0.6 + 0.4 * sleepy);
  // Сама коробка почти чёрная: светятся окна, а не бетон
  c += vec3(0.0038, 0.0043, 0.0070);
  // Корона: часть башен подсвечена по верху. Именно она читается издалека,
  // когда окна уже слились в ровное свечение.
  float cr = step(0.52, h11(vSeed * 53.0 + 9.0)) * office;
  vec3 crc = mix(vec3(0.40, 0.66, 1.0), vec3(1.0, 0.52, 0.26), step(0.5, h11(vSeed * 97.0)));
  c += crc * cr * smoothstep(vH - 6.0, vH - 1.0, vFace.y) * 0.28;
  // Соседние грани чуть разной светимости — иначе куб читается плоским пятном
  c *= 0.86 + 0.14 * dot(vNrm, vec3(0.52, 0.0, 0.85));
  // Даунтаун на дальних планах разгоняем отдельно: там башня — это полоска в
  // один-два пикселя, и в общем ковре огней она обязана быть ярче фона
  c *= 1.0 + (uTowerGain - 1.0) * core * core * max(office, podium);

  o = vec4(c * uBright * uOpacity * fog, 1.0);
}`;let ro=null;function Ja(){const e=[[[1,0,1],[0,0,-2],[0,1,0],[1,0,0]],[[-1,0,-1],[0,0,2],[0,1,0],[-1,0,0]],[[-1,0,1],[2,0,0],[0,1,0],[0,0,1]],[[1,0,-1],[-2,0,0],[0,1,0],[0,0,-1]],[[-1,1,1],[2,0,0],[0,0,-2],[0,1,0]]],t=new Float32Array(160),o=new Uint16Array(30),s=[[0,0],[1,0],[1,1],[0,1]];let a=0,n=0;for(let r=0;r<5;r++){const[i,c,l,u]=e[r];for(let p=0;p<4;p++){const[d,f]=s[p];t[a++]=i[0]+c[0]*d+l[0]*f,t[a++]=i[1]+c[1]*d+l[1]*f,t[a++]=i[2]+c[2]*d+l[2]*f,t[a++]=u[0],t[a++]=u[1],t[a++]=u[2],t[a++]=d,t[a++]=f}const h=r*4;o[n++]=h,o[n++]=h+1,o[n++]=h+2,o[n++]=h,o[n++]=h+2,o[n++]=h+3}return{verts:t,idx:o}}class tn{constructor(t,o){this.gl=t,this.count=o.length/8|0,ro||(ro=vt(t,Qa,Za,"buildings")),this.prog=ro;const s=Ja();this.idxCount=s.idx.length,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufGeo=bt(t,s.verts),t.bindBuffer(t.ARRAY_BUFFER,this.bufGeo),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,32,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,3,t.FLOAT,!1,32,12),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,32,24),this.bufInst=bt(t,o),t.bindBuffer(t.ARRAY_BUFFER,this.bufInst),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,32,0),t.enableVertexAttribArray(4),t.vertexAttribPointer(4,4,t.FLOAT,!1,32,16),t.vertexAttribDivisor(3,1),t.vertexAttribDivisor(4,1),this.bufIdx=bt(t,s.idx,t.ELEMENT_ARRAY_BUFFER),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.bufIdx),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null)}draw(t,o,s,a=1,n=!0,r=1,i=1){if(o<=.004||this.count===0)return;const c=this.gl,l=this.prog;c.useProgram(l.p),c.bindVertexArray(this.vao),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE),c.enable(c.CULL_FACE),c.cullFace(c.BACK),c.depthMask(n),c.uniformMatrix4fv(l.u.uVP,!1,t.vp),c.uniform3fv(l.u.uEye,t.eye),c.uniform1f(l.u.uOpacity,o),c.uniform1f(l.u.uBright,a),c.uniform1f(l.u.uHGain,r),c.uniform1f(l.u.uTowerGain,i),c.uniform1f(l.u.uFogD,t.dist*2.6),c.uniform1f(l.u.uTime,s),c.drawElementsInstanced(c.TRIANGLES,this.idxCount,c.UNSIGNED_SHORT,0,this.count),c.depthMask(!0),c.disable(c.CULL_FACE),c.disable(c.BLEND),c.bindVertexArray(null)}dispose(){const t=this.gl;t.deleteVertexArray(this.vao),t.deleteBuffer(this.bufGeo),t.deleteBuffer(this.bufInst),t.deleteBuffer(this.bufIdx)}}const Ht=[-.035,.355,.055],en=2e4,on=6e4;function Mt(e,t,o,s,a,n={}){const{sx:r=1,sz:i=1,magShell:c=1,magCore:l=1}=n,u=Math.hypot(s[0]-o[0],s[1]-o[1],s[2]-o[2]),h=a*(r+i+1)/3,p=$*h*u+4*Math.PI*h*h,d=Math.PI*h*h*u+4/3*Math.PI*h*h*h,f=Math.round(p*en),m=Math.round(d*on);for(let b=0;b<f+m;b++){const y=b<f,x=e(),A=v(o[0],s[0],x),B=v(o[1],s[1],x),k=v(o[2],s[2],x),w=e()*2-1,S=e()*$,_=Math.sqrt(Math.max(0,1-w*w)),F=_*Math.cos(S),U=w,I=_*Math.sin(S),Y=y?1-.1*e()*e():.86*Math.cbrt(e()),V=y?c:l,K=e(),M=y?[v(.44,.78,K*K),v(.66,.88,K),1]:[.3,.5,.96];t.push({x:A+F*a*Y*r,y:B+U*a*Y,z:k+I*a*Y*i,r:M[0],g:M[1],b:M[2],mag:V*(y?.72+.28*e():.55+.35*e())})}}function sn(e=7){const t=q(e),o=[];Mt(t,o,[0,.655,.004],[0,.735,0],.097,{sz:.92,magShell:.8,magCore:.34}),Mt(t,o,[0,.555,0],[0,.635,.004],.044,{magShell:.72,magCore:.3}),Mt(t,o,[-.175,.52,0],[.175,.52,0],.07,{sz:.8,magShell:.8,magCore:.32}),Mt(t,o,[0,.135,0],[0,.505,0],.132,{sz:.6,magShell:.74,magCore:.3}),Mt(t,o,[-.095,.075,0],[.095,.075,0],.098,{sz:.68,magShell:.74,magCore:.3});for(const r of[-1,1])Mt(t,o,[r*.185,.505,0],[r*.245,.215,.02],.046,{magShell:.76,magCore:.28}),Mt(t,o,[r*.245,.215,.02],[r*.285,-.055,.045],.036,{magShell:.74,magCore:.28}),Mt(t,o,[r*.288,-.075,.05],[r*.295,-.145,.055],.031,{magShell:.78,magCore:.28}),Mt(t,o,[r*.093,.055,0],[r*.105,-.325,.012],.069,{sz:.88,magShell:.74,magCore:.28}),Mt(t,o,[r*.105,-.325,.012],[r*.112,-.74,-.008],.049,{sz:.88,magShell:.74,magCore:.28}),Mt(t,o,[r*.112,-.775,-.02],[r*.114,-.8,.055],.04,{sz:.8,magShell:.72,magCore:.26});const s=[],a=[];for(const r of o){const i=Math.hypot(r.x-Ht[0],r.y-Ht[1],r.z-Ht[2]),c=Math.exp(-(i*i)/(2*.098*.098));c>.08&&(s.push({x:r.x,y:r.y,z:r.z,r:1,g:v(r.g,.44,Math.min(1,c*1.25)),b:v(r.b,.24,Math.min(1,c*1.25)),mag:Math.min(.98,r.mag*(.55+.75*c))}),r.mag*=1-.55*c),a.push(r)}const n=q(e+101);for(let r=0;r<750;r++){let i,c,l,u;do i=n()*2-1,c=n()*2-1,l=n()*2-1,u=i*i+c*c+l*l;while(u>1);const h=.052*Math.pow(u,.22),p=1-Math.sqrt(u)*.55;s.push({x:Ht[0]+i*h*1.15,y:Ht[1]+c*h,z:Ht[2]+l*h*.85,r:1,g:.4+.16*n(),b:.2+.12*n(),mag:T(.42+.26*p,0,1)})}return{body:a,chest:s}}function an(e){const t=e/.92%1,o=Math.exp(-Math.pow((t-.07)/.055,2)),s=.52*Math.exp(-Math.pow((t-.3)/.075,2));return o+s}function nn(e=17,t=1500){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*2-1,r=o()*$,i=Math.sqrt(1-n*n),c=.9+7*Math.pow(o(),.6),l=o()<.35;s.push({x:i*Math.cos(r)*c,y:n*c*.55-.2,z:i*Math.sin(r)*c,r:l?1:.68,g:l?.8:.82,b:l?.56:1,mag:.22+.42*Math.pow(o(),1.8)})}return s}function rn(e=19,t=620){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*$,r=45+380*Math.pow(o(),.7),i=.33+.52*Math.pow(o(),.8),c=o()<.8;s.push({x:Math.sin(n)*r,y:-r*i-2,z:Math.cos(n)*r,r:c?1:.7,g:c?.6+.12*o():.82,b:c?.24+.14*o():1,mag:.55+.45*o()})}return s}function cn(e=29,t=900){const o=q(e),s=[],a=[],n=t,r=55,i=xs,c=Math.cos(So),l=Math.sin(So),u=(d,f)=>{const m=Math.hypot(d,f);return m>r&&m<n},h=Math.ceil(n/i);for(let d=-h;d<=h;d++){const f=d*i;for(let m=-n;m<=n;m+=12)for(let b=0;b<2;b++){const y=b===0?f:m,x=b===0?m:f,A=y*c-x*l,B=y*l+x*c;if(!u(A,B)||o()<.42)continue;const k=o()<.38;s.push({x:A+(o()-.5)*3,y:6.5+o()*3.5,z:B+(o()-.5)*3,r:k?.72:1,g:k?.85:.63,b:k?1:.27,mag:.55+.32*o()}),o()<.55&&a.push({x:A,y:.4,z:B,r:k?.6:1,g:k?.74:.6,b:k?1:.3,mag:.45+.35*o()})}}for(let d=0;d<6800;d++){const f=o()*$,m=r+(n-r)*Math.sqrt(o()),b=Math.cos(f)*m,y=Math.sin(f)*m,x=o()<.3;s.push({x:b,y:1.5+5.5*Math.pow(o(),1.6),z:y,r:x?.74:1,g:x?.86:.66+.16*o(),b:x?1:.3+.22*o(),mag:.26+.34*o()})}for(let d=0;d<2600;d++){const f=o()*$,m=r+(n-r)*Math.sqrt(o());a.push({x:Math.cos(f)*m,y:.8+o()*6,z:Math.sin(f)*m,r:1,g:.72+.16*o(),b:.42+.2*o(),mag:.22+.3*o()})}const p=[];for(let d=0;d<42e3;d++){const f=o()*$,m=Math.sqrt(v(3364,340*340,o())),b=o()<.34,y=o();p.push({x:Math.cos(f)*m,y:.5+16*Math.pow(o(),2.2),z:Math.sin(f)*m,r:b?.7:1,g:b?.84:.64+.16*y,b:b?1:.28+.22*y,mag:.2+.34*Math.pow(o(),1.4)})}return{lights:s,pools:a,near:p}}function ln(e=33,t=2600){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*$,r=120+2600*Math.pow(o(),.75),i=o()<.72;s.push({x:Math.cos(n)*r,y:20+620*Math.pow(o(),1.5),z:Math.sin(n)*r,r:i?1:.72,g:i?.68:.82,b:i?.36:1,mag:.3+.4*o()})}return s}function As(e=11,t=11e3,o=!0){const s=q(e),a=[],n=[],r=[],i=t,c=So,l={x:-.07*i,z:.06*i,s:.23*i,ang:1.02},u={x:.03*i,z:-.02*i},h=(M,z)=>Math.hypot(M-l.x,z-l.z)<l.s,p=M=>.17*i*Math.sin(M/i*1.5+.4)+.05*i,d=M=>200+130*Math.sin(M/i*2.7+1.3),f=[-.6*i,-.32*i,-.06*i,.17*i,.44*i],m=M=>{for(const z of f)if(Math.abs(M-z)<75)return!0;return!1},b=(M,z)=>Math.abs(z-p(M))<d(M)&&!m(M),y=[];for(let M=0;M<5;M++){const z=s()*$,R=Math.pow(s(),.55)*i*.7;y.push({x:Math.cos(z)*R,z:Math.sin(z)*R,s:i*(.065+.07*s())})}const x=[];for(let M=0;M<9;M++){const z=M/9*$+.45*(s()-.5),R=i*(.3+.42*s());x.push({x:Math.cos(z)*R,z:Math.sin(z)*R,s:i*(.13+.09*s()),w:.45+.55*s()})}const A=[];for(let M=0;M<5;M++){const z=s()*$,R=i*(.52+.34*s());A.push({x:Math.cos(z)*R,z:Math.sin(z)*R,ang:s()*$,w:520+380*s(),h:300+260*s()})}function B(M,z){const R=Math.hypot(M,z);if(R>i*1.02)return 0;let E=.18+.78*Math.exp(-Math.pow(R/(i*.42),1.5));for(const C of x){const L=Math.hypot(M-C.x,z-C.z)/C.s;E+=C.w*.5*Math.exp(-L*L)}E*=1-.88*g(i*.78,i*1.02,R);for(const C of y){const L=Math.hypot(M-C.x,z-C.z)/C.s;L<1.7&&(E*=v(.03,1,g(.4,1.5,L)))}return b(M,z)?0:T(E,0,1.4)}function k(M,z,R=0){const E=Math.hypot(M,z),C=T(R+.45*g(i*.12,i*.8,E),0,.92);if(s()<C){const H=s();return[.62+.18*H,.76+.13*H,1]}if(s()<.09)return[.7,.95,.8];const L=s();return[1,.58+.18*L,.22+.2*L]}function w(M,z,R,E,C={}){const{step:L=24,jit:H=9,mag:j=.62,cool:Q=.5,minD:lt=.1,yTop:ut=4,prob:N=1,ok:J=null,col:tt=null,wob:ot=90,out:st=a}=C,W=Math.hypot(R-M,E-z);if(W<1)return;const Z=Math.max(1,Math.round(W/L)),ht=-(E-z)/W,gt=(R-M)/W,zt=1.4+2.2*s(),At=s()*$,Jt=4.5+4*s(),ce=s()*$,ze=ot*(.5+s());for(let _t=0;_t<=Z;_t++){const Nt=_t/Z,le=ze*(Math.sin(Nt*zt*$*.25+At)+.35*Math.sin(Nt*Jt*$*.25+ce)),Bt=v(M,R,Nt)+ht*le+P(s)*H,Ct=v(z,E,Nt)+gt*le+P(s)*H;if(J&&!J(Bt,Ct))continue;const te=B(Bt,Ct);if(te<lt||s()>N*Math.pow(Math.min(1,te),.75))continue;const Dt=tt||k(Bt,Ct,Q);st.push({x:Bt,y:s()*ut,z:Ct,r:Dt[0],g:Dt[1],b:Dt[2],mag:T(j*(.74+.34*Math.min(1,te))*(.82+.36*s()),0,.95)})}}function S(M,z,R){const E=Math.cos(z),C=Math.sin(z),L=Math.ceil(i/M);for(let H=-L;H<=L;H++){const j=H*M+P(s)*M*.13,Q=Math.sqrt(Math.max(0,i*i-j*j));if(!(Q<M*.4)&&!(R.skip&&s()<R.skip)){R.rec&&R.rec.push(j);for(let lt=0;lt<2;lt++){const ut=lt===0?[j,-Q]:[-Q,j],N=lt===0?[j,Q]:[Q,j];w(ut[0]*E-ut[1]*C,ut[0]*C+ut[1]*E,N[0]*E-N[1]*C,N[0]*C+N[1]*E,R)}}}}const _=[],F=[],U=[],I=[];S(1250,c,{step:22,jit:13,mag:.58,cool:.45,skip:.12,wob:130,rec:_,ok:(M,z)=>!h(M,z)}),S(940,l.ang,{step:20,jit:11,mag:.56,cool:.16,skip:.12,wob:110,rec:U,ok:h}),S(Da,c,{step:28,jit:14,mag:.2,cool:.35,prob:.85,wob:40,rec:F,ok:(M,z)=>!h(M,z)}),S(250,l.ang,{step:26,jit:12,mag:.21,cool:.05,prob:.85,wob:34,rec:I,ok:h});for(const[M,z,R]of[[i*.62,.64,.75],[i*.29,.56,.5]]){const E=22/M,C=M*.035;for(let L=0;L<$;L+=E){const H=P(s)*30+C*Math.sin(L*3+1.1),j=Math.cos(L)*(M+H),Q=Math.sin(L)*(M+H),lt=B(j,Q);if(lt<.12||s()>.5+.5*Math.min(1,lt))continue;const ut=k(j,Q,R);a.push({x:j,y:s()*5,z:Q,r:ut[0],g:ut[1],b:ut[2],mag:T(z*(.78+.3*Math.min(1,lt))*(.86+.26*s()),0,.92)})}}for(let M=0;M<7;M++){const z=M/7*$+.22,R=Math.cos(z),E=Math.sin(z),C=M%3===1?.05:.85;for(const L of[-1,1]){const H=L*32;w(R*600-E*H,E*600+R*H,R*i*1-E*H,E*i*1+R*H,{step:24,jit:13,mag:.66,cool:C,yTop:6,minD:.07,wob:150})}}for(let M=-i;M<i;M+=22){const z=p(M),R=d(M);if(!(Math.hypot(M,z)>i*.97))for(const E of[-1,1]){const C=z+E*(R+22+s()*34);B(M,C)<.07||s()>.72||a.push({x:M,y:s()*4,z:C,r:1,g:.66,b:.28,mag:T(.44+.18*s(),0,.72)})}}for(const M of f){const z=p(M),R=d(M);if(!(Math.hypot(M,z)>i*.95))for(let E=-R-90;E<=R+90;E+=15)for(const C of[-16,16])a.push({x:M+C+P(s)*4,y:7+s()*5,z:z+E,r:1,g:.82,b:.52,mag:T(.4+.16*s(),0,.7)})}for(const M of A){const z=Math.cos(M.ang),R=Math.sin(M.ang);for(let E=-M.w;E<=M.w;E+=95)for(let C=-M.h;C<=M.h;C+=120){if(s()<.42)continue;const L=M.x+E*z-C*R+P(s)*12,H=M.z+E*R+C*z+P(s)*12;b(L,H)||a.push({x:L,y:8+s()*14,z:H,r:.9,g:.94,b:1,mag:T(.42+.2*s(),0,.74)})}}for(let M=0;M<800;M++){const z=u.x+P(s)*i*.075,R=u.z+P(s)*i*.075;b(z,R)||a.push({x:z,y:45+210*Math.pow(s(),1.7),z:R,r:.82,g:.89,b:1,mag:T(.38+.2*s(),0,.74)})}for(let M=0;M<34e3;M++){const z=s()*$,R=i*Math.sqrt(s()),E=Math.cos(z)*R,C=Math.sin(z)*R,L=B(E,C);if(L<=0||s()>L*.4)continue;const H=k(E,C,.22);a.push({x:E,y:s()*24-1,z:C,r:H[0],g:H[1],b:H[2],mag:T((.18+.2*s())*(.62+.48*Math.min(1,L)),0,.48)})}for(let M=0;M<46e3;M++){const z=s()*$,R=i*1.02*Math.sqrt(s()),E=Math.cos(z)*R,C=Math.sin(z)*R,L=B(E,C);if(L<=.02||s()>Math.min(1,L)*.92)continue;const H=T(.1+.55*g(i*.15,i*.85,R),0,.9),j=s()<H?[.66,.78,1]:[1,.66,.3];n.push({x:E,y:4+s()*20,z:C,r:j[0],g:j[1],b:j[2],mag:T(.26+.4*Math.min(1,L)*(.7+.5*s()),0,.8)})}{for(let z=-Math.ceil(700/46);z<=Math.ceil(700/46);z++)for(let R=-700;R<=700;R+=13)for(let E=0;E<2;E++){const C=E===0?z*46:R,L=E===0?R:z*46,H=C+(s()-.5)*4,j=L+(s()-.5)*4;if(Math.hypot(H,j)>700||b(H,j)||s()>.45)continue;const Q=k(H,j,.2);r.push({x:H,y:s()*9-1,z:j,r:Q[0],g:Q[1],b:Q[2],mag:T(.36+.22*s(),0,.7)})}for(let z=0;z<5e3;z++){const R=s()*$,E=700*Math.sqrt(s()),C=Math.cos(R)*E,L=Math.sin(R)*E;if(b(C,L))continue;const H=k(C,L,.12);r.push({x:C,y:s()*42-1,z:L,r:H[0],g:H[1],b:H[2],mag:T(.22+.28*s(),0,.6)})}}const Y=i*8;{for(let M=0;M<44;M++){const z=s()*$,R=i*(1.15+7*Math.pow(s(),1.35)),E=Math.cos(z)*R,C=Math.sin(z)*R,L=i*(.02+.05*s()),H=90+Math.round(320*s());for(let j=0;j<H;j++){const Q=k(0,i*.9,.05);a.push({x:E+P(s)*L,y:s()*14-1,z:C+P(s)*L,r:Q[0],g:Q[1],b:Q[2],mag:T(.32+.28*s(),0,.7)})}for(const j of[0,1])for(let Q=-L*1.6;Q<=L*1.6;Q+=28)s()<.35||a.push({x:E+(j?Q:P(s)*8),y:s()*5,z:C+(j?P(s)*8:Q),r:1,g:.7,b:.32,mag:T(.44+.22*s(),0,.78)});n.push({x:E,y:8,z:C,r:1,g:.7,b:.34,mag:T(.3+.3*s(),0,.72)})}for(let M=0;M<7;M++){const z=M/7*$+.22,R=Math.cos(z),E=Math.sin(z);for(let C=i;C<Y;C+=95){if(s()>.55)continue;const L=P(s)*70;a.push({x:R*C-E*L,y:s()*4,z:E*C+R*L,r:1,g:.7,b:.36,mag:T(.3+.24*s(),0,.6)})}}for(let M=0;M<21e3;M++){const z=s()*$,R=v(i*1.05,Y,Math.pow(s(),1.7)),E=k(0,i*.95,.02);a.push({x:Math.cos(z)*R,y:s()*8-1,z:Math.sin(z)*R,r:E[0],g:E[1],b:E[2],mag:T(.22+.28*Math.pow(s(),1.4),0,.6)})}}const V=o?K():new Float32Array(0);function K(){const M=[],E=(N,J)=>N-J;_.sort(E),F.sort(E),U.sort(E),I.sort(E);const C=[i*.62,i*.29],L=(N,J)=>{const tt=Math.hypot(N,J);for(const ot of C)if(Math.abs(tt-ot)<55)return!0;return!1},H=(N,J)=>{const tt=Math.hypot(N,J);if(tt<520)return!1;const ot=Math.atan2(J,N),st=Math.min(120,.16*tt);for(let W=0;W<7;W++){let Z=ot-(W/7*$+.22);if(Z=Math.atan2(Math.sin(Z),Math.cos(Z)),Math.abs(Z)*tt<st)return!0}return!1},j=(N,J,tt)=>{for(let ot=0;ot<J.length;ot++)if(Math.abs(N-J[ot])<tt)return!0;return!1},Q=(N,J,tt,ot)=>{const st=g(150,520,ot),W=Math.hypot(N-u.x,J-u.z),Z=Math.exp(-Math.pow(W/1250,1.8))*v(.28,1,st);let ht,gt;if(s()<.014+.7*Math.pow(Z,1.25)){gt=1;const zt=Math.pow(s(),1.45);ht=v(v(48,165,Z),v(105,460,Z),zt)}else gt=0,ht=(10+26*Math.pow(s(),1.5))*(.8+.5*Math.min(1,tt))*(1+.85*Z);return{h:ht*v(.42,1,st),kind:gt+Math.min(.97,Z)}};function lt(N,J,tt,ot,st){const W=Math.cos(tt),Z=Math.sin(tt);for(let ht=0;ht+1<N.length;ht++){const gt=N[ht]+17,zt=N[ht+1]-17,At=zt-gt;if(!(At<44))for(let Jt=0;Jt+1<N.length;Jt++){const ce=N[Jt]+17,ze=N[Jt+1]-17,_t=ze-ce;if(_t<44)continue;const Nt=(gt+zt)*.5,le=(ce+ze)*.5,Bt=Nt*W-le*Z,Ct=Nt*Z+le*W;if(Math.hypot(Bt,Ct)>i||ot&&!ot(Bt,Ct)||B(Bt,Ct)<.13)continue;const te=.8+.45*s(),Dt=Math.max(1,Math.round(At/(st*te))),je=Math.max(1,Math.round(_t/(st*te)));for(let Ke=0;Ke<Dt;Ke++)for(let Xe=0;Xe<je;Xe++){const ee=At/Dt*.5-5,oe=_t/je*.5-5;if(ee<9||oe<9)continue;const Qe=gt+(Ke+.5)*(At/Dt)+P(s)*2.5,Ze=ce+(Xe+.5)*(_t/je)+P(s)*2.5,kt=Qe*W-Ze*Z,St=Qe*Z+Ze*W,Je=Math.hypot(kt,St);if(Je<62||Je>i)continue;const Ae=B(kt,St);if(Ae<.12||b(kt,St)||b(kt+ee,St+oe)||b(kt-ee,St-oe)||L(kt,St)||H(kt,St)||j(Qe,J,58)||j(Ze,J,58)||s()>T(.22+.74*Ae*Ae,0,.92))continue;const ue=Q(kt,St,Ae,Je),ts=Math.floor(ue.kind)===1;let ke,Se;if(ts){const os=v(12,26,Math.pow(s(),.8));ke=Math.min(ee,os*(.8+.5*s())),Se=Math.min(oe,os*(.8+.5*s()))}else ke=ee*(.52+.34*s()),Se=oe*(.52+.34*s());const es=tt+P(s)*.012;M.push([kt,St,ke,Se,ue.h,es,s(),ue.kind]),ts&&ue.h>130&&s()<.72&&M.push([kt,St,Math.min(ee,ke*1.95),Math.min(oe,Se*1.95),13+24*s(),es,s(),2+(ue.kind-1)])}}}}lt(F,_,c,(N,J)=>!h(N,J),xs),lt(I,U,l.ang,h,118);for(const N of A){const J=Math.cos(N.ang),tt=Math.sin(N.ang);for(let ot=-N.w;ot<=N.w;ot+=175)for(let st=-N.h;st<=N.h;st+=215){if(s()<.42)continue;const W=N.x+ot*J-st*tt,Z=N.z+ot*tt+st*J;Math.hypot(W,Z)>i||b(W,Z)||M.push([W,Z,38+30*s(),52+38*s(),8+11*s(),N.ang+P(s)*.03,s(),3])}}const ut=new Float32Array(M.length*8);for(let N=0;N<M.length;N++)ut.set(M[N],N*8);return ut}return{streets:a,glow:n,home:r,buildings:V}}function un(e=23,t=34e3){const o=q(e),s=[],a=[];for(let i=0;i<26;i++){const c=o()*2-1,l=o()*$,u=Math.sqrt(1-c*c);a.push({x:u*Math.cos(l),y:c,z:u*Math.sin(l),r:.13+o()*.3,w:.25+o()})}const n=[];for(let i=0;i<34;i++){const c=(o()*2-1)*.82,l=o()*$,u=Math.sqrt(1-c*c);n.push({x:u*Math.cos(l),y:c,z:u*Math.sin(l),r:.02+.035*o()})}let r=0;for(;s.length<t&&r<t*40;){r++;const i=o()*2-1,c=o()*$,l=Math.sqrt(1-i*i),u=l*Math.cos(c),h=i,p=l*Math.sin(c);let d=Math.pow(1-Math.abs(h),.7),f=0;for(const y of a){const x=Math.hypot(u-y.x,h-y.y,p-y.z);x<y.r&&(f=Math.max(f,y.w*(1-x/y.r)))}d*=f;let m=0;for(const y of n){const x=Math.hypot(u-y.x,h-y.y,p-y.z);x<y.r&&(m=Math.max(m,1-x/y.r))}if(d=Math.max(d,m*.9),o()>d*1.4)continue;const b=o()<.22+.3*m;s.push({x:u,y:h,z:p,r:b?.86:1,g:b?.9:.7,b:b?1:.36,mag:T(.3+.45*o()*d+.35*m,0,1)})}return s}function hn(e=31,t=2200){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*.9+.06,r=o()*$,i=Math.sqrt(1-n*n),c=9e3,l=Math.pow(o(),2.4),u=v(.35,1,g(.05,.45,n)),h=o()<.3;s.push({x:i*Math.cos(r)*c,y:n*c,z:i*Math.sin(r)*c,r:h?1:.74,g:h?.86:.84,b:h?.72:1,mag:(.12+.62*l)*u})}return s}function ks(e=37,t=1900,o=2e5){const s=q(e),a=[];for(let n=0;n<t;n++){const r=s()*.94+.04,i=s()*$,c=Math.sqrt(1-r*r),l=Math.pow(s(),2.4),u=v(.3,1,g(.04,.4,r)),h=s()<.3;a.push({x:c*Math.cos(i)*o,y:r*o,z:c*Math.sin(i)*o,r:h?1:.74,g:h?.86:.84,b:h?.72:1,mag:(.14+.68*l)*u})}return a}const pn={id:"human",init(e){const t=sn();this.body=new G(e,D(t.body),{sizeBase:1.25,sizeGain:1.4,brightness:.62,spikes:0}),this.chest=new G(e,D(t.chest),{sizeBase:1.5,sizeGain:2.2,brightness:.85,spikes:.12}),this.motes=new G(e,D(nn()),{sizeBase:1.3,sizeGain:5,brightness:.42,spikes:.45,twinkle:.9}),this.bokeh=new G(e,D(rn()),{sizeBase:2.2,sizeGain:26,brightness:.03,spikes:0,twinkle:.25});const o=As(11,11e3);this.blocks=new tn(e,o.buildings),this.city=new G(e,D(o.streets),{sizeBase:1.3,sizeGain:3.2,brightness:.58,spikes:.22,twinkle:.35}),this.cityGlow=new G(e,D(o.glow),{sizeBase:4.2,sizeGain:3.6,brightness:.36,spikes:0,twinkle:.08}),this.cityHome=new G(e,D(o.home),{sizeBase:1.25,sizeGain:2.6,brightness:.5,spikes:.12,twinkle:.3}),this.sky=new G(e,D(hn()),{sizeBase:1.3,sizeGain:4.4,brightness:.4,spikes:.55,twinkle:.8}),this.citySky=new G(e,D(ks()),{sizeBase:1.3,sizeGain:4.6,brightness:.46,spikes:.6,twinkle:.7});const s=cn();this.district=new G(e,D(s.lights),{sizeBase:1.2,sizeGain:2.6,brightness:.62,spikes:.18,twinkle:.3}),this.pools=new G(e,D(s.pools),{sizeBase:7,sizeGain:9,brightness:.085,spikes:0,twinkle:.12}),this.nearGround=new G(e,D(s.near),{sizeBase:1.15,sizeGain:2,brightness:.42,spikes:0,twinkle:.25}),this.airGlow=new G(e,D(ln()),{sizeBase:8,sizeGain:11,brightness:.02,spikes:0,twinkle:.15}),this.glow=new qo(e)},draw(e,t,o,s,a){const n=1-g(1.2,2,a),r=an(s),i=n*(1-g(.7,1.6,a));i>.002&&this.bokeh.draw(t,o*i,s),n>.002&&this.motes.draw(t,o*n,s);const c=1-g(2.6,3.3,a);c>.002&&this.sky.draw(t,o*.75*c,s);const l=g(2.6,3.3,a);l>.002&&this.citySky.draw(t,o*l,s);const u=g(1,2.2,a),h=g(2.6,3.4,a)*u;h>.002&&this.cityGlow.draw(t,o*h,s,{brightness:.36*h});const p=g(1.95,2.35,a)*(1-g(4.06,4.19,a));if(p>.004){const y=p*v(o,1,g(3.3,3.9,a)),x=me([[2.4,1],[3.3,1],[3.9,.56],[4.12,.5]],a),A=v(1,3,g(3.4,4.15,a)),B=v(1,11,g(3.4,4.15,a));this.blocks.draw(t,y,s,x,a<3.35&&p>.3,A,B)}u>.002&&this.city.draw(t,o*u,s,{brightness:.9*u});const d=g(1,1.8,a)*(1-g(3.1,3.75,a));d>.002&&this.cityHome.draw(t,o*d,s,{brightness:.5*d});const f=g(1.3,1.95,a)*(1-g(2.85,3.6,a));f>.002&&(this.pools.draw(t,o*f,s,{brightness:v(.085,.05,g(2,2.5,a))}),this.district.draw(t,o*f,s,{brightness:.62*f}));const m=g(1.35,1.95,a)*(1-g(2.35,3,a));m>.002&&this.nearGround.draw(t,o*m,s,{brightness:.42*m});const b=g(1.5,2.1,a)*(1-g(3.2,4,a));b>.002&&this.airGlow.draw(t,o*b,s),n>.002&&(this.body.draw(t,o*n,s,{brightness:.72*n*(1+.05*r)}),this.chest.draw(t,o*n,s,{brightness:(.15+.15*r)*n}),this.glow.draw(t,Ht,.34+.05*r,[1,.3,.1],(.045+.055*r)*n*o,{core:2.6,fall:3,flat:.55}))}};function fn(e=67){const t=q(e),o=[],s=[],a=No,n=(h,p)=>{const d=Math.hypot(h,p);if(d<1)return[0,1,0];const f=d/a,m=Math.sin(f)/d;return[h*m,Math.cos(f),p*m]},r=(h,p,d,f,m)=>{const b=n(p,d);h.push({x:b[0],y:b[1],z:b[2],r:f[0],g:f[1],b:f[2],mag:m})},i=(h,p)=>{const d=h*.6+p*.8,f=-h*.8+p*.6;return d-(62e4+24e4*Math.sin(f/64e4+.6)+9e4*Math.sin(f/19e4+1.7))},c=[1,.66,.3],l=[.72,.82,1],u=[];for(let h=0;h<260;h++){const p=26e3*Math.pow(107.6923076923077,Math.pow(t(),.92)),d=t()*$,f=p*Math.cos(d),m=p*Math.sin(d),b=i(f,m);if(b>0)continue;const y=b>-12e4?1.35:1,x=T(Math.pow(t(),2.3)*y,0,1);u.push({x:f,z:m,s:p,pop:x,rad:1400+15e3*x})}u.sort((h,p)=>h.s-p.s);for(const h of u){const p=Math.round(30+620*h.pop),d=T(.18+.45*h.pop,0,.8);for(let f=0;f<p;f++){const m=t()<d?l:c;r(o,h.x+P(t)*h.rad,h.z+P(t)*h.rad,m,T(.34+.42*t()*(.5+h.pop),0,.95))}if(h.pop>.35){const f=t()*$;for(const m of[0,Math.PI/2]){const b=Math.cos(f+m),y=Math.sin(f+m);for(let x=-h.rad*2.6;x<=h.rad*2.6;x+=h.rad*.16)t()<.4||r(o,h.x+b*x+P(t)*h.rad*.12,h.z+y*x+P(t)*h.rad*.12,c,T(.4+.24*t(),0,.85))}}s.push(...[n(h.x,h.z)].map(f=>({x:f[0],y:f[1],z:f[2],r:1,g:.74,b:.42,mag:T(.28+.62*h.pop,0,.95)})))}for(let h=1;h<u.length;h++){const p=u[h];let d=null,f=1/0;for(let b=0;b<h;b++){const y=u[b],x=Math.hypot(p.x-y.x,p.z-y.z);x<f&&(f=x,d=y)}if(!d||f>42e4)continue;const m=Math.max(4,Math.round(f/9e3));for(let b=1;b<m;b++){const y=b/m,x=Math.sin(y*Math.PI)*f*.09*(t()<.5?-1:1),A=-(d.z-p.z)/f,B=(d.x-p.x)/f,k=v(p.x,d.x,y)+A*x,w=v(p.z,d.z,y)+B*x;i(k,w)>0||t()<.45||r(o,k,w,c,T(.2+.18*t(),0,.55))}}for(let h=0;h<26e3;h++){const p=12e3*Math.pow(250,t()),d=t()*$,f=p*Math.cos(d),m=p*Math.sin(d);i(f,m)>0||t()>.3+.7/(1+p/5e5)||r(o,f,m,t()<.22?l:c,T(.14+.26*Math.pow(t(),1.5),0,.55))}return{lights:o,glow:s}}const dn={id:"earth",init(e){this.earth=new It(e,{type:4,baseColor:[1,1,1],atmo:.038,atmoColor:[.22,.42,.95],seed:3.1,spinRate:.012,tilt:1.02}),this.lights=new no(e,D(un()),{size:1.05,gain:2.2,brightness:1.8});const t=fn();this.region=new no(e,D(t.lights),{size:1.15,gain:2.6,brightness:2}),this.regionGlow=new no(e,D(t.glow),{size:5.5,gain:7,brightness:.16});const o=As(11,11e3,!1),s=a=>({...a,x:a.x/1e4,y:a.y/1e4,z:a.z/1e4});this.city=new G(e,D(o.streets.map(s)),{sizeBase:1.25,sizeGain:3,brightness:.86,spikes:.2,twinkle:.35}),this.cityGlow=new G(e,D(o.glow.map(s)),{sizeBase:4,sizeGain:3.4,brightness:.36,spikes:0,twinkle:.08}),this.stars=new G(e,D(He(53,2400,5e3)),{sizeBase:1.3,sizeGain:5.2,brightness:.78,spikes:.6,twinkle:.4}),this.lowStars=new G(e,D(ks(59,1700,200)),{sizeBase:1.3,sizeGain:4.8,brightness:.58,spikes:.6,twinkle:.7}),this.glow=new qo(e)},draw(e,t,o,s,a){const n=No/1e4,r=g(6.35,7.15,a),i=v(-n,0,r),c=g(4.3,5,a)*(1-g(6.3,6.95,a));c>.002&&this.stars.draw(t,o*c*.85,s);const l=g(3.45,3.95,a)*(1-g(4.35,5,a));l>.002&&this.lowStars.draw(t,o*l*.85,s);const u=1-g(4.6,5.8,a);if(u>.002){const A=v(.98,.56,g(4.2,5.3,a))*u;this.cityGlow.draw(t,o*u,s,{brightness:.36*u}),this.city.draw(t,o*u,s,{brightness:A}),this.glow.draw(t,[0,.004,0],.62,[1,.56,.24],.016*u*o,{core:1.2,fall:2.4,flat:.9})}const h=s*.05+.9,p=[Math.cos(h),-.19,Math.sin(h)],d=Math.hypot(p[0],p[1],p[2]);p[0]/=d,p[1]/=d,p[2]/=d;const f=v(.1,1,g(4.9,5.9,a)),m=this.earth.cfg.atmoColor;m[0]=.22*f,m[1]=.42*f,m[2]=.95*f;const b=g(4.3,5.1,a);b>.002&&(this.earth.draw(t,[0,i,0],n,o*b*.92,s,p),this.lights.draw(t,[0,i,0],n*1.001,p,o*b,{brightness:1.8*b}));const y=g(4.15,4.85,a)*(1-g(6.35,7.05,a));y>.002&&(this.regionGlow.draw(t,[0,i,0],n*1.0004,p,o*y,{brightness:.16*y}),this.region.draw(t,[0,i,0],n*1.0008,p,o*y,{brightness:2*y}));const x=g(5.7,5.85,a)*(1-g(6.25,6.5,a));if(x>.002){const A=.5+.5*Math.sin(s*$*.8),B=[0,i+n*1.0007,0],k=t.viewR;this.glow.draw(t,B,k*.032*(1+.22*A),[1,.58,.2],(.22+.3*A)*x*o,{core:4,fall:3,flat:.25}),this.glow.draw(t,B,k*.26,[1,.78,.44],(.16+.1*A)*x*o,{core:90,fall:22,flat:0,ring:1,ringR:.42+.16*A,ringW:.045})}}};function mn(e=41,t=3400,o=1e5){const s=q(e),a=[];for(let n=0;n<t;n++){const r=s()*2-1,i=s()*$,c=Math.sqrt(1-r*r),l=Math.pow(s(),2.8),u=T(.5+(s()*1.8-.3)*.4,0,1);a.push({x:c*Math.cos(i)*o,y:r*o,z:c*Math.sin(i)*o,r:v(.68,1,u),g:v(.8,.84,1-Math.abs(u-.5)*2),b:v(1,.68,u),mag:.1+.78*l})}return a}const co=.09,vn=[[7.3,.02],[7.9,.06],[8.06,.2],[8.14,.44],[8.2,.62],[8.27,.8],[8.34,.74],[8.42,.58],[8.5,.43],[8.56,.33],[8.66,.16],[8.78,.08],[8.9,.04]],bn=[[7.3,1.85],[7.9,1.65],[8.06,1.35],[8.14,1.02],[8.2,.84],[8.27,.68],[8.34,.7],[8.42,.76],[8.5,.82],[8.56,.84],[8.9,.86]],gn=[[8.89,0],[9.05,.42],[9.3,.98],[9.75,1.55],[10.2,1.95]],yn=[[7.3,-.4],[7.9,-.6],[8.06,-.85],[8.14,-.92],[8.2,-.88],[8.27,-.78],[8.34,-.62],[8.42,-.46],[8.5,-.32],[8.56,-.24],[8.9,-.1]],xn={id:"moon",init(e){this.earth=new It(e,{type:4,baseColor:[1,1,1],atmo:.045,atmoColor:[.26,.46,1],seed:3.1,spinRate:.012,tilt:1.02}),this.moon=new It(e,{type:3,baseColor:[.44,.42,.395],atmo:0,seed:8.4,spinRate:.01}),this.orbit=new Xa(e,{a:Te/1e6,b:Te/1e6*.9985,inc:co,segments:720}),this.stars=new G(e,D(mn()),{sizeBase:1.35,sizeGain:6.5,brightness:.72,spikes:.7,twinkle:.35}),this.glow=new qo(e),this.buf=ws()},draw(e,t,o,s,a){const n=Na/1e6,r=t.viewR||Te/1e6,i=t.dist>0?t.viewR/t.dist:.3839;this.stars.draw(t,o*.8,s);const c=zs(a),l=c>1e-4?Ms(t,this.buf,rs.x*c,rs.y*c):t,u=l.eye,h=(1-.45*g(9.45,10.05,a))*(1-g(10.05,10.22,a)),p=1+.45*c,d=1-g(10,10.19,a),f=Math.pow(Math.pow(Te/1e6,4)+Math.pow(r*.16*h*p,4),.25),m=s*.1-4.05+me(gn,a),b=[Math.cos(m)*f,Math.sin(m)*f*Math.sin(co),Math.sin(m)*f*Math.cos(co)],y=b[0]-u[0],x=b[1]-u[1],A=b[2]-u[2],B=Math.hypot(y,x,A)||1,k=Do(l),w=me(vn,a),S=T((y*k.R[0]+x*k.R[1]+A*k.R[2])/B*6,-1,1),_=me(bn,a)*S,F=me(yn,a),U=k.F[0]+k.R[0]*(_*i*k.aspect)+k.U[0]*(F*i),I=k.F[1]+k.R[1]*(_*i*k.aspect)+k.U[1]*(F*i),Y=k.F[2]+k.R[2]*(_*i*k.aspect)+k.U[2]*(F*i),V=Math.hypot(U,I,Y)||1,K=n/Math.max(1e-5,w*i),M=1-g(7.9,8.1,a),z=Math.max(M,g(8.45,8.8,a)),R=Math.max(M,g(8.62,8.95,a));let E=v(U/V,y/B,z),C=v(I/V,x/B,z),L=v(Y/V,A/B,z);const H=Math.hypot(E,C,L)||1;E/=H,C/=H,L/=H;const j=Math.exp(v(Math.log(K),Math.log(B),R)),Q=u[0]+E*j,lt=u[1]+C*j,ut=u[2]+L*j,N=Math.pow(Math.pow(No/1e6,4)+Math.pow(r*.048*h*p,4),.25),J=Math.hypot(Q-u[0],lt-u[1],ut-u[2])||1,tt=Math.pow(Math.pow(n,4)+Math.pow(.028*h*p*J*i,4),.25),ot=tt/J/i,st=g(9.2,9.6,a),W=[-.9,-.16,.37],Z=Math.hypot(W[0],W[1],W[2]);if(W[0]/=Z,W[1]/=Z,W[2]/=Z,st>.002){const zt=Va(l,c);W[0]=v(W[0],zt[0],st),W[1]=v(W[1],zt[1],st),W[2]=v(W[2],zt[2],st);const At=Math.hypot(W[0],W[1],W[2])||1;W[0]/=At,W[1]/=At,W[2]/=At}const ht=v(o,Math.max(o,.97*d),c),gt=g(8.66,8.92,a)*(1-g(10,10.2,a));gt>.003&&(this.orbit.a=f,this.orbit.b=f*.9985,this.orbit.draw(l,m/$,ht*gt*.5,{color:[.16,.26,.52],head:[.55,.76,1],base:v(.22,.34,c),headAmt:v(1.5,.55,c)})),this.glow.draw(l,[0,0,0],N*2.8,[.3,.54,1],.26*ht*(1-.62*c),{core:2.6,fall:3.4,flat:.5}),this.earth.draw(l,[0,0,0],N,ht,s,W),this.glow.draw(l,[Q,lt,ut],tt*2.2,[.66,.72,.92],.03*ht*(1-.9*g(.06,.22,ot)),{core:3,fall:3.4,flat:.35}),this.moon.draw(l,[Q,lt,ut],tt,ht,s,W)}};function He(e=41,t=2600,o=1e5){const s=q(e),a=[];for(let n=0;n<t;n++){const r=s()*2-1,i=s()*Math.PI*2,c=Math.sqrt(1-r*r),l=Math.pow(s(),2.6),u=s()*1.8-.3,h=T(.5+u*.35,0,1);a.push({x:c*Math.cos(i)*o,y:r*o,z:c*Math.sin(i)*o,r:v(.72,1,h),g:v(.82,.86,1-Math.abs(h-.5)*2),b:v(1,.72,h),mag:.12+.75*l})}return a}const Mn=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in float aT;   // 0..1 вдоль линии — для градиента
uniform mat4 uVP;
out float vT;
void main(){
  vT = aT;
  gl_Position = uVP * vec4(aPos, 1.0);
}`,wn=`#version 300 es
precision highp float;
in float vT;
out vec4 o;
uniform vec3 uColor;
uniform float uOpacity, uHead, uFalloff;
void main(){
  // Голова линии (там, где тело) ярче хвоста — читается направление движения.
  // База pow зажата: на d3d11 pow идёт через log, и когда интерполяция vT
  // чуть заезжает под ноль, рождается NaN — блум-пирамида размазывала эти
  // пиксели в чёрный экран на всей остановке «Ланиакея». SwiftShader прощал.
  float g = mix(1.0, pow(max(vT, 1e-4), uFalloff), uHead);
  o = vec4(uColor * g * uOpacity, 1.0);
}`;let lo=null;class Ss{constructor(t,o,s,a="strip"){this.gl=t,this.count=o.length/3,this.mode=a,lo||(lo=vt(t,Mn,wn,"lines")),this.prog=lo,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=bt(t,o),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.bufT=bt(t,s||new Float32Array(this.count).fill(1)),t.bindBuffer(t.ARRAY_BUFFER,this.bufT),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,1,t.FLOAT,!1,0,0),t.bindVertexArray(null)}draw(t,o,s=[.35,.45,.65],{head:a=.85,falloff:n=2.2}={}){if(o<=.003)return;const r=this.gl,i=this.prog;r.useProgram(i.p),r.bindVertexArray(this.vao),r.uniformMatrix4fv(i.u.uVP,!1,t.vp),r.uniform3fv(i.u.uColor,s),r.uniform1f(i.u.uOpacity,o),r.uniform1f(i.u.uHead,a),r.uniform1f(i.u.uFalloff,n),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE),r.depthMask(!1),r.drawArrays(this.mode==="strip"?r.LINE_STRIP:r.LINES,0,this.count),r.depthMask(!0),r.disable(r.BLEND),r.bindVertexArray(null)}dispose(){const t=this.gl;t.deleteVertexArray(this.vao),t.deleteBuffer(this.bufPos),t.deleteBuffer(this.bufT)}}const To=1e3/be,Gt=Math.PI*2,$t=[{id:"mercury",name:"Меркурий",a:.3871,e:.2056,inc:.1222,R:2439.7,P:.2408,color:[.62,.58,.53],spark:[.92,.86,.74],type:0,seed:1.2},{id:"venus",name:"Венера",a:.72333,e:.0068,inc:.0593,R:6051.8,P:.6152,color:[.93,.85,.66],spark:[1,.9,.66],type:0,seed:2.4,atmo:.07,atmoColor:[.95,.85,.6]},{id:"earth",name:"Земля",a:1,e:.0167,inc:0,R:6371,P:1,color:[1,1,1],spark:[.52,.76,1],type:4,seed:3.1,phase:5.72,atmo:.05,atmoColor:[.3,.52,1]},{id:"mars",name:"Марс",a:1.52371,e:.0934,inc:.0323,R:3389.5,P:1.8808,color:[.78,.42,.26],spark:[1,.48,.28],type:0,seed:4.7,atmo:.02,atmoColor:[.8,.5,.35]},{id:"jupiter",name:"Юпитер",a:5.2044,e:.0489,inc:.0227,R:69911,P:11.862,color:[.84,.72,.55],spark:[1,.84,.6],type:1,seed:5.9},{id:"saturn",name:"Сатурн",a:9.58256,e:.0565,inc:.0434,R:58232,P:29.457,color:[.88,.8,.62],spark:[1,.9,.62],type:1,seed:6.3,ring:[1.24,2.27]},{id:"uranus",name:"Уран",a:19.21845,e:.0457,inc:.0135,R:25362,P:84.011,color:[.6,.83,.87],spark:[.58,.94,.96],type:1,seed:7.7},{id:"neptune",name:"Нептун",a:30.11039,e:.0113,inc:.0309,R:24622,P:164.79,color:[.32,.47,.86],spark:[.36,.58,1],type:1,seed:8.8}],Ro=695700*To,We=[1,.86,.6],zn=.26,An=3.05;function kn(e){return g(9.44,9.63,e)*(1-g(10.25,10.62,e))}function Sn(e,t){const o=g(9.43,9.7,e),s=g(10,10.6,e),a=Math.max(Ro/t,.02);return Math.exp(v(Math.log(v(zn,An,o)),Math.log(a),s))}const Tn=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec4 aColorMag;

uniform mat4 uVP, uModel;
uniform float uProjScale;   // (высота вьюпорта / 2) / tan(fov/2)
uniform float uWorldSize;   // физический радиус объекта, юниты оболочки (0 = выкл)
uniform float uSizeBase, uSizeGain, uBrightness, uPerspDim, uMaxPx;
uniform float uTime, uTwinkle;

out vec3 vColor;
out float vAlpha;

void main(){
  vec3 wp = (uModel * vec4(aPos, 1.0)).xyz;
  vec4 clip = uVP * vec4(wp, 1.0);
  gl_Position = clip;

  float lum = pow(aColorMag.a, 2.2);
  float pxMag = uSizeBase * (1.0 + uSizeGain * lum);
  float pxPer = uWorldSize > 0.0 ? uWorldSize * uProjScale / max(clip.w, 1e-8) : 0.0;
  float size = clamp(max(pxMag, pxPer), 1.0, uMaxPx);
  gl_PointSize = size;

  // Ближняя комета крупнее — но не во столько же раз ярче: иначе одна льдинка
  // у самого объектива выжигает весь кадр. Поток растёт ~линейно с размером.
  float a = lum * uBrightness * mix(1.0, pxMag / size, uPerspDim);
  if(uTwinkle > 0.0){
    float ph = dot(aPos, vec3(12.9898, 78.233, 37.719));
    a *= 1.0 + uTwinkle * 0.35 * sin(uTime * 2.1 + ph);
  }

  vColor = aColorMag.rgb;
  vAlpha = a;
  if(clip.w <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,Rn=`#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
out vec4 o;
uniform float uOpacity, uSoft;
void main(){
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r = length(uv);
  if(r > 1.0) discard;
  // uSoft = 0 — точка-звезда, uSoft = 1 — размытая пылинка (зодиакальный свет)
  float core = exp(-r * r * mix(24.0, 2.2, uSoft));
  float halo = exp(-r * mix(6.0, 2.4, uSoft)) * mix(0.16, 0.42, uSoft);
  float a = (core + halo) * smoothstep(1.0, 0.72, r);
  if(a <= 0.0) discard;
  o = vec4(vColor * a * vAlpha * uOpacity, 1.0);
}`,En=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);let uo=null;class dt{constructor(t,o,s={}){this.gl=t;const a=D(o);this.count=a.pos.length/3,this.opts={sizeBase:1.4,sizeGain:2,brightness:.5,soft:0,worldSize:0,perspDim:.85,maxPx:64,twinkle:0,...s},uo||(uo=vt(t,Tn,Rn,"swarm")),this.prog=uo,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=bt(t,a.pos),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.bufCol=bt(t,a.color),t.bindBuffer(t.ARRAY_BUFFER,this.bufCol),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.UNSIGNED_BYTE,!0,0,0),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null)}draw(t,o,s,a={}){if(o<=.002||this.count===0)return;const n=this.gl,r={...this.opts,...a},i=this.prog;n.useProgram(i.p),n.bindVertexArray(this.vao);const c=t.viewportH*.5*(t.dist/t.viewR);n.uniformMatrix4fv(i.u.uVP,!1,t.vp),n.uniformMatrix4fv(i.u.uModel,!1,r.model||En),n.uniform1f(i.u.uProjScale,c),n.uniform1f(i.u.uWorldSize,r.worldSize),n.uniform1f(i.u.uSizeBase,r.sizeBase*(t.pixelScale||1)),n.uniform1f(i.u.uSizeGain,r.sizeGain),n.uniform1f(i.u.uBrightness,r.brightness),n.uniform1f(i.u.uPerspDim,r.perspDim),n.uniform1f(i.u.uMaxPx,r.maxPx*(t.pixelScale||1)),n.uniform1f(i.u.uTime,s),n.uniform1f(i.u.uTwinkle,r.twinkle),n.uniform1f(i.u.uOpacity,o),n.uniform1f(i.u.uSoft,r.soft),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE),n.depthMask(!1),n.drawArrays(n.POINTS,r.first||0,r.count!==void 0?Math.min(r.count,this.count):this.count),n.depthMask(!0),n.disable(n.BLEND),n.bindVertexArray(null)}}const Ts=`#version 300 es
precision highp float;
uniform mat4 uVP;
uniform vec3 uCenter, uRight, uUp;
uniform float uRadius;
out vec2 vUv;
void main(){
  vec2 c = vec2(float(gl_VertexID & 1), float((gl_VertexID >> 1) & 1)) * 2.0 - 1.0;
  vUv = c;
  vec3 wp = uCenter + (uRight * c.x + uUp * c.y) * uRadius;
  gl_Position = uVP * vec4(wp, 1.0);
}`,Pn=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform vec3 uColor;
uniform float uOpacity, uCore, uCoreAmt, uHalo, uHaloK;
uniform float uSpikes, uSpikeLen, uRays, uRayAmt, uPhase, uWhite;
void main(){
  float r = length(vUv);
  if(r > 1.0) discard;
  float core = exp(-r * r * uCore) * uCoreAmt;
  float halo = exp(-r * uHaloK) * uHalo;

  float rays = 0.0;
  if(uRayAmt > 0.0){
    float ang = atan(vUv.y, vUv.x);
    float m = 0.5 + 0.5 * sin(ang * uRays + sin(ang * 3.0 + uPhase * 0.7) * 1.4 + uPhase);
    rays = pow(m, 3.0) * exp(-r * 2.4) * uRayAmt;
  }
  float sp = 0.0;
  if(uSpikes > 0.0){
    vec2 a = abs(vUv);
    float h = exp(-a.y * 60.0) * exp(-a.x * uSpikeLen);
    float v = exp(-a.x * 60.0) * exp(-a.y * uSpikeLen);
    sp = (h + v) * uSpikes;
  }
  float amt = (core + halo + rays + sp) * smoothstep(1.0, 0.88, r);
  // Белым горит только самая сердцевина — цвет живёт на всём остальном
  vec3 c = mix(uColor, vec3(1.0), clamp(core * 1.6 - 0.55, 0.0, 1.0) * uWhite) * amt;
  if(amt <= 0.0) discard;
  o = vec4(c * uOpacity, 1.0);
}`;let ho=null;function Rs(e,t){const o=[t[0]-e.eye[0],t[1]-e.eye[1],t[2]-e.eye[2]],s=Math.hypot(o[0],o[1],o[2])||1;o[0]/=s,o[1]/=s,o[2]/=s;const a=Math.abs(o[1])>.95?[0,0,1]:[0,1,0],n=[o[1]*a[2]-o[2]*a[1],o[2]*a[0]-o[0]*a[2],o[0]*a[1]-o[1]*a[0]],r=Math.hypot(n[0],n[1],n[2])||1;n[0]/=r,n[1]/=r,n[2]/=r;const i=[n[1]*o[2]-n[2]*o[1],n[2]*o[0]-n[0]*o[2],n[0]*o[1]-n[1]*o[0]];return{right:n,up:i}}class Vo{constructor(t){this.gl=t,ho||(ho=vt(t,Ts,Pn,"glow")),this.prog=ho}draw(t,o,s,a,n={}){if(a<=.002||s<=0)return;const r=this.gl,i=this.prog;r.useProgram(i.p),r.bindVertexArray(null);const c=Rs(t,o);r.uniformMatrix4fv(i.u.uVP,!1,t.vp),r.uniform3fv(i.u.uCenter,o),r.uniform3fv(i.u.uRight,c.right),r.uniform3fv(i.u.uUp,c.up),r.uniform1f(i.u.uRadius,s),r.uniform3fv(i.u.uColor,n.color||[1,1,1]),r.uniform1f(i.u.uOpacity,a),r.uniform1f(i.u.uCore,n.core??40),r.uniform1f(i.u.uCoreAmt,n.coreAmt??1),r.uniform1f(i.u.uHalo,n.halo??.18),r.uniform1f(i.u.uHaloK,n.haloK??5),r.uniform1f(i.u.uSpikes,n.spikes??0),r.uniform1f(i.u.uSpikeLen,n.spikeLen??3.2),r.uniform1f(i.u.uRays,n.rays??11),r.uniform1f(i.u.uRayAmt,n.rayAmt??0),r.uniform1f(i.u.uPhase,n.phase??0),r.uniform1f(i.u.uWhite,n.white??1),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE),r.depthMask(!1),r.drawArrays(r.TRIANGLE_STRIP,0,4),r.depthMask(!0),r.disable(r.BLEND)}}const _n=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform vec3 uColor;
uniform float uOpacity, uR0, uW, uGap;
void main(){
  float r = length(vUv);
  float d = (r - uR0) / uW;
  float ring = exp(-d * d);
  if(uGap > 0.0){
    // |sin 2φ| обнуляется на осях — четыре мягких разрыва
    float a = atan(vUv.y, vUv.x);
    ring *= smoothstep(0.0, uGap, abs(sin(a * 2.0)));
  }
  if(ring <= 0.002) discard;
  o = vec4(uColor * ring * uOpacity, 1.0);
}`;let po=null;class Bn{constructor(t){this.gl=t,po||(po=vt(t,Ts,_n,"markring")),this.prog=po}draw(t,o,s,a,n={}){if(a<=.002||s<=0)return;const r=this.gl,i=this.prog;r.useProgram(i.p),r.bindVertexArray(null);const c=Rs(t,o);r.uniformMatrix4fv(i.u.uVP,!1,t.vp),r.uniform3fv(i.u.uCenter,o),r.uniform3fv(i.u.uRight,c.right),r.uniform3fv(i.u.uUp,c.up),r.uniform1f(i.u.uRadius,s),r.uniform3fv(i.u.uColor,n.color||[1,1,1]),r.uniform1f(i.u.uOpacity,a),r.uniform1f(i.u.uR0,n.r0??.68),r.uniform1f(i.u.uW,n.width??.075),r.uniform1f(i.u.uGap,n.gap??.35),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE),r.depthMask(!1),r.drawArrays(r.TRIANGLE_STRIP,0,4),r.depthMask(!0),r.disable(r.BLEND)}}const Cn=`#version 300 es
precision highp float;
uniform vec2 uCenter;   // центр диска, ПОЛУВЫСОТЫ кадра (0,0 — центр экрана)
uniform float uRadius, uAspect, uMargin;
out vec2 vP;            // смещение от центра диска, полувысоты
void main(){
  vec2 c = vec2(float(gl_VertexID & 1), float((gl_VertexID >> 1) & 1)) * 2.0 - 1.0;
  vP = c * (uRadius * uMargin);
  vec2 p = uCenter + vP;
  // Полуширина кадра = uAspect полувысот, поэтому по X делим на неё
  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);
}`,Fn=`#version 300 es
precision highp float;
in vec2 vP;
out vec4 o;
uniform float uRadius, uTime, uOpacity, uDetail;
${Oo}

void main(){
  float rn = length(vP) / uRadius;
  // Ширина пикселя в долях радиуса: и сглаживание лимба, и минимальная
  // толщина хромосферы. Без неё усохшая до десятка пикселей стена получает
  // ступенчатый край и нитку тоньше пикселя, то есть мерцающий пунктир.
  float aa = max(fwidth(rn), 1e-5);
  // Окно: свечение обязано дойти до нуля РАНЬШЕ кромки квада, иначе у стены
  // проступает прямой шов билборда (та же беда, что у короны Body).
  float win = 1.0 - smoothstep(1.05, 1.40, rn);
  if(win <= 0.0015) discard;

  vec3 col = vec3(0.0);

  // ── ТЕЛО: конвекция на полусфере ──────────────────────────────────────────
  float inside = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, rn);
  if(inside > 0.002){
    float rc = min(rn, 1.0);
    // Косинус угла между лучом и нормалью. Шум берётся в точке ПОЛУСФЕРЫ, а не
    // на плоском диске: только так ячейки к лимбу сжимаются в ракурсе, и стена
    // читается как шар, а не как круглая заплатка с текстурой.
    float mu = sqrt(max(1e-4, 1.0 - rc * rc));
    vec3 n = vec3(vP / uRadius, mu);
    // Дрейф детерминированный, от t кадра: медленный поворот шара плюс
    // сползание самого шума. Кипение должно быть заметно на глаз, но не
    // «бурлить»: у настоящей грануляции время жизни ячейки — минуты.
    float a = uTime * 0.010;
    float ca = cos(a), sa = sin(a);
    vec3 q = vec3(n.x * ca - n.z * sa, n.y, n.x * sa + n.z * ca);

    float cells = fbm(q * 12.0 + vec3(0.0, uTime * 0.007, 0.0), 4);
    float vein = ridged(q * 14.0 + vec3(0.0, 0.0, uTime * 0.013), 4);
    float boil = fbm(q * 34.0 + vec3(uTime * 0.04, 0.0, uTime * 0.025), 2);

    // uDetail гасит мелкое кипение, когда стена усохла до десятков пикселей:
    // там оно уже не фактура, а шум размером с пиксель, и он мерцает на зуме.
    float k = clamp(0.30 + (cells - 0.42) * 1.9 + (boil - 0.47) * 0.8 * uDetail, 0.0, 1.0);
    // Лимбовое потемнение настоящее и глубокое: без него стена — плоская
    // оранжевая плита, а с ним у неё появляется объём и золотой обод.
    float limbD = mix(0.14, 1.0, pow(mu, 0.55));

    // Палитра держится в РЫЖЕМ. Зелёный канал придушен вдвое против красного,
    // синий почти выключен: стоит отпустить их — и ACES с экспозицией 1,55
    // сводит всю стену в бледно-жёлтую засветку, на которой голубой шарик Земли
    // уже не найти. Жёлто-белым горят только прожилки, и то на пике.
    //
    // Нижний край палитры НЕ уходит в чёрное: у плазмы не бывает погасших мест,
    // и глубокие тёмные провалы читаются как остывшая лава, а не как звезда.
    // Самое тёмное здесь — всё ещё светящийся тёмно-красный.
    vec3 c = mix(vec3(0.62, 0.115, 0.022), vec3(0.98, 0.30, 0.040), smoothstep(0.0, 0.45, k));
    c = mix(c, vec3(1.0, 0.58, 0.17), smoothstep(0.45, 1.0, k));
    col += c * mix(0.44, 0.86, k) * limbD * inside;

    // Прожилки — самое яркое, что есть на стене; только они и уходят в блум
    float v = pow(smoothstep(0.64, 0.96, vein), 1.5);
    col += vec3(1.0, 0.66, 0.30) * v * 1.15 * limbD * inside;
  }

  // ── ЛИМБ: хромосфера и намёки на протуберанцы ─────────────────────────────
  float out_ = max(rn - 1.0, 0.0);
  float w = max(0.005, aa * 1.5);
  col += vec3(1.0, 0.34, 0.11) * exp(-abs(rn - 1.0) / w) * 1.8;
  // Спад свечения наружу гасим маской (1 − inside), и это НЕ придирка: внутри
  // диска out_ = 0, экспонента равна единице, и без маски вся стена получала
  // ровную добавку 0,55 поверх фактуры — плазма выцветала в бледно-жёлтую плиту.
  col += vec3(1.0, 0.40, 0.14) * exp(-out_ * 26.0) * 0.55 * (1.0 - inside);
  if(out_ > 0.0){
    // Языки по углу: там, где шум даёт гребень, свечение уходит дальше за лимб
    float ang = atan(vP.y, vP.x);
    float pr = fbm(vec3(cos(ang), sin(ang), uTime * 0.010) * 2.4 + 11.0, 3);
    float tongue = smoothstep(0.50, 0.84, pr);
    col += vec3(1.0, 0.21, 0.07) * tongue * exp(-out_ / mix(0.004, 0.030, tongue)) * 1.5;
    col += vec3(1.0, 0.46, 0.20) * exp(-out_ * 4.5) * 0.085;
  }

  col *= win * uOpacity;
  if(max(col.r, max(col.g, col.b)) < 0.0015) discard;
  o = vec4(col, 1.0);
}`;let fo=null;class Ln{constructor(t){this.gl=t,fo||(fo=vt(t,Cn,Fn,"plasmawall")),this.prog=fo}draw(t,o,s,a,n,r){if(n<=.002||a<=0)return;const i=this.gl,c=this.prog;i.useProgram(c.p),i.bindVertexArray(null);const l=t.viewportW&&t.viewportH?t.viewportW/t.viewportH:16/9,u=a*(t.viewportH||720)*.5;i.uniform2f(c.u.uCenter,o,s),i.uniform1f(c.u.uRadius,a),i.uniform1f(c.u.uAspect,l),i.uniform1f(c.u.uMargin,1.5),i.uniform1f(c.u.uTime,r),i.uniform1f(c.u.uOpacity,n),i.uniform1f(c.u.uDetail,T((u-30)/170,0,1)),i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),i.depthMask(!1),i.drawArrays(i.TRIANGLE_STRIP,0,4),i.depthMask(!0),i.disable(i.BLEND)}}const On=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in float aTheta;
uniform mat4 uVP;
uniform float uHead, uFalloff, uBase;
out float vG;
void main(){
  float d = mod(uHead - aTheta, 6.28318530718) / 6.28318530718; // 0 у планеты
  vG = uBase + (1.0 - uBase) * pow(1.0 - d, uFalloff);
  gl_Position = uVP * vec4(aPos, 1.0);
}`,Un=`#version 300 es
precision highp float;
in float vG;
out vec4 o;
uniform vec3 uColor;
uniform float uOpacity;
void main(){ o = vec4(uColor * vG * uOpacity, 1.0); }`;let mo=null;class Es{constructor(t,o,s=640){this.gl=t;const a=new Float32Array(s*3),n=new Float32Array(s);for(let r=0;r<s;r++){const i=r/(s-1)*Gt,c=Ps(o,i);a[r*3]=c[0],a[r*3+1]=c[1],a[r*3+2]=c[2],n[r]=i}this.count=s,mo||(mo=vt(t,On,Un,"trail")),this.prog=mo,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=bt(t,a),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.bufT=bt(t,n),t.bindBuffer(t.ARRAY_BUFFER,this.bufT),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,1,t.FLOAT,!1,0,0),t.bindVertexArray(null)}draw(t,o,s,{head:a=0,falloff:n=3,base:r=.22}={}){if(o<=.003)return;const i=this.gl,c=this.prog;i.useProgram(c.p),i.bindVertexArray(this.vao),i.uniformMatrix4fv(c.u.uVP,!1,t.vp),i.uniform3fv(c.u.uColor,s),i.uniform1f(c.u.uOpacity,o),i.uniform1f(c.u.uHead,a),i.uniform1f(c.u.uFalloff,n),i.uniform1f(c.u.uBase,r),i.enable(i.BLEND),i.blendFunc(i.ONE,i.ONE),i.depthMask(!1),i.drawArrays(i.LINE_STRIP,0,this.count),i.depthMask(!0),i.disable(i.BLEND),i.bindVertexArray(null)}}function Ps(e,t){const o=e.a,s=o*Math.sqrt(1-e.e*e.e),a=o*Math.cos(t)-o*e.e,n=s*Math.sin(t);return[a,n*Math.sin(e.inc),n*Math.cos(e.inc)]}function Ho(e,t,o=1){return t*o/e.P+(e.phase??e.seed)}function Eo(e,t,o=1){return Ps(e,Ho(e,t,o))}function In(e,t,o,s,a){const n=Math.cos(s),r=Math.sin(s),i=Math.cos(a),c=Math.sin(a),l=[i,0,-c],u=[r*c,n,r*i],h=[n*c,-r,n*i];return e[0]=l[0]*o,e[1]=l[1]*o,e[2]=l[2]*o,e[3]=0,e[4]=u[0]*o,e[5]=u[1]*o,e[6]=u[2]*o,e[7]=0,e[8]=h[0]*o,e[9]=h[1]*o,e[10]=h[2]*o,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}const Wo=Math.PI*(3-Math.sqrt(5));function Gn(e){let t=0,o=26;for(let s=0;s<44;s++){const a=(t+o)*.5;1-(1+a)*Math.exp(-a)<e?t=a:o=a}return(t+o)*.5}function Yo(e,t){let o=1/t,s=0,a=e;for(;a>0;)s+=o*(a%t),a=Math.floor(a/t),o/=t;return s}function _s(e,t,o,s,a=.13){const n=q(e),r=[];for(let i=0;i<t;i++){const c=.035+o*Gn((i+n())/t);if(c>s)continue;const l=i*Wo+n()*.9,u=-Math.log(1-Yo(i+1,3)*.985)*(.05+a*c),h=i&1?-u:u,p=T(c/s,0,1),d=1-p*.55;r.push({x:Math.cos(l)*c,y:h,z:Math.sin(l)*c,r:v(.82,1,d),g:v(.66,.84,d),b:v(.62,.5,d),mag:.64-.2*p})}return r}function Po(e,t,o,s,a=.16,n=.62,r=.018){const i=q(e),c=[];for(let l=0;l<t;l++){const u=r+(s-r)*Math.pow((l+i())/t,n),h=l*Wo+i()*.9,p=-Math.log(1-Yo(l+1,3)*.985)*(.04+a*u)*.8,d=l&1?-p:p,f=1-T(u/s,0,1)*.55;c.push({x:Math.cos(h)*u,y:d,z:Math.sin(h)*u,r:v(.82,1,f),g:v(.66,.84,f),b:v(.62,.5,f),mag:.86*Math.exp(-u/(2.2*o))})}return c}function Nn(e,t,o,s){const a=q(e),n=[];for(let r=0;r<s;r++){const i=(r+.5)/s,c=t+(o-t)*Math.pow(i,.72),l=r*Wo+a()*.05,u=-Math.log(1-Yo(r+1,3)*.985)*(.6+.055*c),h=r&1?-u:u,p=T((c-t)/(o-t),0,1),d=Math.pow(1-p,1.4);n.push({x:Math.cos(l)*c,y:h,z:Math.sin(l)*c,r:v(.44,.98,d),g:v(.62,.8,d),b:v(1,.58,d),mag:.58})}return n}function Dn(e,t,o,s,a,n,r,i){const c=q(e),l=[];for(let u=0;u<s;u++){const h=c(),p=t+(o-t)*Math.sqrt(h),d=c()*Gt,f=(c()-.5)*a*p,m=[2.06,2.5,2.82,2.95,3.27];let b=!1;for(const x of m)Math.abs(p-x)<.022&&(b=c()<.75);if(b)continue;const y=c();l.push({x:Math.cos(d)*p,y:f,z:Math.sin(d)*p,r:v(n[0],r[0],y),g:v(n[1],r[1],y),b:v(n[2],r[2],y),mag:i*(.62+.38*c())})}return l}function qn(e,t,o){const s=q(e),a=[],n=(r,i,c)=>{const l=s()*Gt,u=(s()-.5)*i*r,h=s();a.push({x:Math.cos(l)*r,y:u,z:Math.sin(l)*r,r:v(.32,.6,h),g:v(.64,.82,h),b:1,mag:c*(.62+.38*s())})};for(let r=0;r<t;r++){let i=29+22*Math.sqrt(s());const c=s();c<.2?i=39.4+(s()-.5)*1.9:c<.28&&(i=47.8+(s()-.5)*1.4),!(i<34&&s()<.55)&&n(i,.16,.66)}for(let r=0;r<o;r++){const i=50+48*Math.pow(s(),.8);n(i,.34,.52)}return a}function Vn(e,t){const o=q(e),s=[];for(let a=0;a<t;a++){const n=1.15+1.15*Math.sqrt(o());if(n>1.92&&n<2.02&&o()<.85)continue;const r=o()*Gt,i=.55+.45*g(1.15,1.7,n);s.push({x:Math.cos(r)*n,y:(o()-.5)*.012,z:Math.sin(r)*n,r:.95*i,g:.88*i,b:.72*i,mag:.55+.3*o()})}return s}const vo=120;function Bs(e,t,o){const s=2/(1+Math.max(e,-.998));return t*Math.min(Math.pow(s,.46),o)}function cs(e,t,o,s,a){const n=q(e),r=[],i=o*s;let c=t*12;for(;r.length<t&&c-- >0;){const l=n()*2-1,u=Bs(l,o,s);if(n()>Math.pow(u/i,1.7))continue;const h=n()*Gt,p=Math.sqrt(1-l*l),d=u*(.972+n()*.056),f=g(-.5,1,l),m=Math.pow(g(.35,1,l),2);let b,y,x,A;a?(b=v(.9,1,f),y=v(.5,.7,f),x=v(.3,.42,f),A=.4+.18*f+.08*n()):(b=v(.18,.44,f)+m*.09,y=v(.44,.78,f)+m*.05,x=1,A=.52+.12*f+.06*m+.08*n()),r.push({x:l*d,y:p*Math.cos(h)*d,z:p*Math.sin(h)*d,r:b,g:y,b:x,mag:A})}return r}function Hn(e,t,o){const s=q(e),a=[];for(let n=0;n<t;n++){const r=s()*2-1,i=s()*Gt,c=Math.sqrt(1-r*r),l=Bs(r,o,2.6)*.94,u=l*Math.pow(s(),.55),h=T(u/l,0,1);a.push({x:r*u,y:c*Math.cos(i)*u,z:c*Math.sin(i)*u,r:v(1,.55,h),g:v(.82,.66,h),b:v(.58,.92,h),mag:.3+.22*(1-h)+.08*s()})}return a}const _o=[{name:"Вояджер-1",r:167,lat:.609,lon:.17,color:[1,.93,.72],ph:0},{name:"Вояджер-2",r:140,lat:-.845,lon:.66,color:[.95,.88,.78],ph:2.1}].map(e=>({...e,pos:[e.r*Math.cos(e.lat)*Math.cos(e.lon),e.r*Math.sin(e.lat),e.r*Math.cos(e.lat)*Math.sin(e.lon)]}));function Wn(e,t){const s=new Float32Array(192),a=new Float32Array(64);for(let n=0;n<64;n++){const r=n/63,i=Math.sin(r*Math.PI)*.1;s[n*3]=t.pos[0]*r+t.pos[2]*i,s[n*3+1]=t.pos[1]*r,s[n*3+2]=t.pos[2]*r-t.pos[0]*i,a[n]=r}return new Ss(e,s,a,"strip")}function Yn(e=77,t=88e3){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*2-1,r=o()*Gt,i=Math.sqrt(1-n*n),c=5e3*Math.pow(21,Math.pow(o(),.42)),l=T(Math.log(c/5e3)/Math.log(21),0,1),u=o(),h=Math.pow(l,1.35)*(1-.62*g(.8,1,l)),p=Math.pow(o(),2.1);s.push({x:i*Math.cos(r)*c,y:n*c*.93,z:i*Math.sin(r)*c,r:v(.16,.42,u*.45+(1-l)*.55),g:v(.46,.74,u*.45+(1-l)*.55),b:1,mag:.19+.48*h+.28*p})}return s}function $n(e=78,t=44e3){const o=q(e),s=[];for(let a=0;a<t;a++){const n=o()*2-1,r=o()*Gt,i=Math.sqrt(1-n*n),c=1500*Math.pow(17,Math.pow(o(),1)),l=T(Math.log(c/1500)/Math.log(17),0,1),u=v(.19,.84,l),h=o(),p=Math.pow(o(),2.1);s.push({x:i*Math.cos(r)*c,y:n*c*u,z:i*Math.sin(r)*c,r:v(.74,.3,l),g:v(.88,.6,l),b:1,mag:.12+.44*Math.pow(l,.8)+.22*p+.06*h})}return s}function Cs(e){return{shell:new dt(e,cs(551,78e3,vo,1.85,!1),{sizeBase:3.4,sizeGain:1.2,brightness:.36,soft:.55,maxPx:26}),shock:new dt(e,cs(552,22e3,vo*.62,1.5,!0),{sizeBase:3,sizeGain:1,brightness:.3,soft:.6,maxPx:22}),haze:new dt(e,Hn(553,2e4,vo),{sizeBase:3.2,sizeGain:.9,brightness:.05,soft:1,maxPx:44}),trails:_o.map(t=>Wn(e,t))}}function Fs(e,t,o,s,a,n=s){if(n>.004&&e.haze.draw(o,n,a),!(s<=.004)){e.shock.draw(o,s,a),e.shell.draw(o,s,a);for(let r=0;r<_o.length;r++){const i=_o[r];e.trails[r].draw(o,s*.16,[.5,.6,.82],{head:1,falloff:2.4});const c=.74+.26*Math.sin(a*2.3+i.ph)+.1*Math.sin(a*5.7+i.ph*2);t.draw(o,i.pos,o.viewR*.042,s*c,{color:i.color,core:24,coreAmt:2.1,halo:.16,haloK:5,spikes:.75,spikeLen:2.2,white:.9})}}}function $o(e,t,o,s,a,n){const r=Ro*(o.viewportH*.5)/o.viewR,i=g(60,95,r)*(n.bodyK??1);i>.003&&e.draw(o,[0,0,0],Ro,s*i,a),t.draw(o,[0,0,0],o.viewR*n.glowFrac,s,{color:We,core:n.core??34,coreAmt:n.coreAmt??1,halo:n.halo??.16,haloK:n.haloK??4.4,spikes:n.spikes??0,spikeLen:n.spikeLen??2.4,rays:13,rayAmt:n.rayAmt??.1,phase:a*.09,white:n.white??1})}function Ls(e,t,o,s,a,n){e.draw(t,o,a,n,{color:s.spark||s.color,core:17,coreAmt:1.5,halo:.16,haloK:5.2,spikes:.45,spikeLen:2.8,white:.45})}const jn={id:"inner",init(e){this.sun=new It(e,{type:2,baseColor:We,seed:.5,spinRate:.02}),this.glow=new Vo(e),this.wall=new Ln(e),this.mark=new Bn(e),this.earth=$t.find(t=>t.id==="earth"),this.bodies={},this.orbits={};for(const t of $t.slice(0,4))this.bodies[t.id]=new It(e,{type:t.type,baseColor:t.color,seed:t.seed,atmo:t.atmo||0,atmoColor:t.atmoColor||[.3,.5,1],spinRate:.4}),this.orbits[t.id]=new Es(e,t);this.zodiacHaze=new dt(e,Po(213,2e4,.4,2.6),{sizeBase:56,sizeGain:.4,brightness:.008,soft:1,maxPx:170}),this.zodiacCore=new dt(e,Po(215,11e4,.085,.45,.16,1,.01),{sizeBase:25,sizeGain:.4,brightness:.00125,soft:1,maxPx:90}),this.zodiac=new dt(e,_s(211,15e4,.36,2.3),{sizeBase:8,sizeGain:.4,brightness:.0024,soft:1,maxPx:40}),this.stars=new G(e,D(He(43,3e3,5e4)),{sizeBase:1.4,sizeGain:6,brightness:.4,spikes:.7,twinkle:.25}),this.buf=ws()},draw(e,t,o,s,a){this.stars.draw(t,o*.55,s);const n=zs(a),r=n>1e-4?Ms(t,this.buf,ae.x*n,ae.y*n):t,i=kn(a);if(i>.002){const x=t.viewportW&&t.viewportH?t.viewportW/t.viewportH:1.7777777777777777;this.wall.draw(t,ae.x*n*x,ae.y*n,Sn(a,t.viewR),Math.max(o,.9)*i,s)}const c=.35,l=o*g(10,10.8,a)*(1-g(11.9,12.4,a)),u=o*g(9.7,10.15,a)*(1-g(10.85,11.45,a));this.zodiacCore.draw(r,u,s),this.zodiacHaze.draw(r,l*g(10.5,11,a),s),this.zodiac.draw(r,l,s);const h=g(10.15,11,a),p=1-g(10.9,11.5,a);for(const x of $t.slice(0,4)){const A=Ho(x,s,c),B=x.spark||x.color,k=[v(.26,B[0],.3),v(.46,B[1],.3),v(.95,B[2],.3)];this.orbits[x.id].draw(r,o*h*v(.46,.72,p),k,{head:A,falloff:v(3.2,5.4,p),base:v(.18,.04,p)})}const d=g(10.45,10.6,a)*(1-g(11.95,12.35,a)),f=g(10.55,10.7,a)*(1-g(11.3,11.5,a)),m=d*(1-g(11.6,12,a)),b=v(o,Math.max(o,.62),n)*(1-.99*i);$o(this.sun,this.glow,r,b,s,{glowFrac:v(.17,.155,m)+.2*n,core:30,coreAmt:v(.46,.4,m)+.26*n,halo:v(.24,.17,m),haloK:v(3.2,3.9,m),rayAmt:.15,white:.55,bodyK:1-n});const y=r.viewportH*.5/r.viewR;for(const x of $t.slice(0,4)){const A=Eo(x,s,c),B=Math.hypot(A[0],A[1],A[2])||1,k=[-A[0]/B,-A[1]/B,-A[2]/B];if(x.R*To*y>2&&this.bodies[x.id].draw(r,A,x.R*To,o,s,k),x===this.earth&&d>.004){const w=x.spark;this.glow.draw(r,A,r.viewR*v(.02,.024,d),o,{color:[v(w[0],.42,d),v(w[1],.72,d),1],core:v(17,15,d),coreAmt:v(1.5,1.8,d),halo:v(.16,.105,d),haloK:v(5.2,7,d),spikes:v(.45,.62,d),spikeLen:v(2.8,3.5,d),white:v(.45,.14,d)})}else Ls(this.glow,r,A,x,r.viewR*.02,o)}if(f>.004){const x=.72+.28*Math.sin(s*2.2);this.mark.draw(r,Eo(this.earth,s,c),r.viewR*.08,o*f*.17*x,{color:[.48,.74,1],r0:.74,width:.048,gap:.3})}}},Kn={id:"outer",init(e){this.sun=new It(e,{type:2,baseColor:We,seed:.5}),this.glow=new Vo(e),this.orbits={};for(const t of $t)this.orbits[t.id]=new Es(e,t);this.zodiacHaze=new dt(e,Po(214,17e3,.62,4.2),{sizeBase:52,sizeGain:.4,brightness:.0105,soft:1,maxPx:180}),this.zodiac=new dt(e,_s(212,6e4,.55,3.6),{sizeBase:10,sizeGain:.5,brightness:.0022,soft:1,maxPx:48}),this.dust=new dt(e,Nn(219,3.2,58,26e3),{sizeBase:22,sizeGain:.4,brightness:.0022,soft:1,maxPx:120}),this.asteroids=new dt(e,Dn(101,2.06,3.28,4e4,.1,[1,.8,.48],[.8,.66,.5],.74),{sizeBase:1.4,sizeGain:1.4,brightness:.72,soft:.18,maxPx:18}),this.kuiper=new dt(e,qn(103,52e3,26e3),{sizeBase:1.5,sizeGain:1.5,brightness:.66,soft:.18,maxPx:20}),this.ring=new dt(e,Vn(307,9e3),{sizeBase:1.1,sizeGain:1,brightness:.75,soft:.2,maxPx:14}),this.ringM=new Float32Array(16),this.helio=Cs(e),this.stars=new G(e,D(He(43,3e3,5e5)),{sizeBase:1.4,sizeGain:6,brightness:.45,spikes:.7,twinkle:.25})},draw(e,t,o,s,a){this.stars.draw(t,o*.65,s);const n=.35,r=g(13.1,13.5,a),i=o*(1-g(12.2,12.8,a));this.zodiacHaze.draw(t,i,s),this.zodiac.draw(t,i,s),this.dust.draw(t,o*g(11.85,12.55,a)*(1-g(13.5,14.1,a)),s),this.asteroids.draw(t,o*(1-g(12.9,13.7,a)),s),this.kuiper.draw(t,o*g(12.3,12.9,a)*(1-g(13.9,14.5,a)),s);const c=1-g(13.9,14.5,a);for(const u of $t){const h=u.a<2?1-g(12.4,13.2,a):v(1,.45,r);if(h<.01)continue;const p=Ho(u,s,n),d=[v(.32,u.color[0],.45),v(.46,u.color[1],.45),v(.85,u.color[2],.45)];this.orbits[u.id].draw(t,o*c*h*.6,d,{head:p,falloff:2.6,base:.24})}Fs(this.helio,this.glow,t,o*r,s,o*g(12.55,13.15,a));const l=v(v(.17,.065,g(11.9,12.95,a)),.045,r);$o(this.sun,this.glow,t,o,s,{glowFrac:l,core:26,coreAmt:.46,halo:v(.2,.26,r),haloK:v(2.5,3.4,r),rayAmt:.15,white:.45});for(const u of $t){const h=(u.a<2?1-g(12.5,13.3,a):1)*v(1,.5,r);if(h<.01)continue;const p=Eo(u,s,n);if(u.ring){const f=t.viewR*.0095;In(this.ringM,p,f,.466,.6),this.ring.draw(t,o*h*c,s,{model:this.ringM})}const d=t.viewR*(u.R>2e4?.026:.017);Ls(this.glow,t,p,u,d,o*h)}}},Xn={id:"oort",init(e){this.sun=new It(e,{type:2,baseColor:We,seed:.5}),this.glow=new Vo(e),this.oortOuter=new dt(e,Yn(),{sizeBase:2,sizeGain:1.4,soft:.25,perspDim:.5,maxPx:70}),this.oortInner=new dt(e,$n(),{sizeBase:1.8,sizeGain:1.4,soft:.25,perspDim:.5,maxPx:70}),this.helio=Cs(e),this.stars=new G(e,D(He(47,3600,2e6)),{sizeBase:1.5,sizeGain:6.5,brightness:.55,spikes:.8,twinkle:.2})},draw(e,t,o,s,a){this.stars.draw(t,o*.8,s);const n=1-g(14.6,15.5,a);Fs(this.helio,this.glow,t,o*n,s);const r=g(15.1,16.4,a),i=o*g(14.1,14.9,a)*(1-g(16.6,17.02,a)),c=t.viewR*.0075,l=v(.22,.6,r),u=v(120,70,r);this.oortOuter.draw(t,i,s,{worldSize:c,perspDim:l,maxPx:u,brightness:v(.86,.78,r)}),this.oortInner.draw(t,i,s,{worldSize:c,perspDim:l,maxPx:u,brightness:v(.88,.46,r)}),$o(this.sun,this.glow,t,o,s,{glowFrac:v(.05,.03,r),core:34,coreAmt:v(.34,.22,r),halo:v(.17,.085,r),haloK:4.4,rayAmt:v(.16,.3,r),white:.18,spikes:v(.1,.5,r),spikeLen:2})}},Qn=828004181;async function Os(e){try{const t=await fetch(e,{cache:"force-cache"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const o=await t.arrayBuffer();return Zn(o,e)}catch(t){return console.warn(`[каталог] ${e} недоступен (${t.message}) — процедурная замена`),null}}function Zn(e,t=""){const o=new DataView(e);if(o.getUint32(0,!0)!==Qn)throw new Error(`${t}: не UZC1`);const s=o.getUint32(4,!0),a=o.getFloat32(8,!0),n=16+s*16;if(e.byteLength<n)throw new Error(`${t}: обрезан (${e.byteLength} < ${n})`);const r=new Float32Array(s*3),i=new Uint8Array(s*4),c=new DataView(e,16);for(let l=0;l<s;l++){const u=l*16;r[l*3]=c.getFloat32(u,!0),r[l*3+1]=c.getFloat32(u+4,!0),r[l*3+2]=c.getFloat32(u+8,!0),i[l*4]=c.getUint8(u+12),i[l*4+1]=c.getUint8(u+13),i[l*4+2]=c.getUint8(u+14),i[l*4+3]=c.getUint8(u+15)}return{pos:r,color:i,count:s,unitMeters:a}}const Ge=8.178,ye=Math.PI/180,Jn=`#version 300 es
precision highp float;
layout(location = 0) in vec4 aPosSize;  // xyz — позиция, w — диаметр пятна в юнитах оболочки
layout(location = 1) in vec4 aColorAmp; // rgb + амплитуда 0..1

uniform mat4 uVP;
uniform vec3 uEye;
uniform float uProjScale; // (высота вьюпорта / 2) / tan(fov/2): пикселей на юнит на расстоянии 1
uniform float uIntensity;
uniform float uMinPx, uMaxPx;

out vec3 vColor;
out float vAmp;

void main(){
  vec4 clip = uVP * vec4(aPosSize.xyz, 1.0);
  gl_Position = clip;

  float d = max(length(aPosSize.xyz - uEye), 1e-9);
  float px = aPosSize.w * uProjScale / d;

  // Мельче минимального размера пятно не сжимаем, а ГАСИМ пропорционально
  // потерянной площади: иначе далёкое свечение собирается в яркую крупу,
  // и вместо мягкого фона получается манная каша.
  float shrink = 1.0;
  if(px < uMinPx){ shrink = px / uMinPx; px = uMinPx; }
  gl_PointSize = min(px, uMaxPx);

  vColor = aColorAmp.rgb;
  vAmp = aColorAmp.a * uIntensity * shrink * shrink;

  if(clip.w <= 0.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // за спиной — выкинуть
}`,t0=`#version 300 es
precision highp float;
in vec3 vColor;
in float vAmp;
out vec4 o;
uniform float uOpacity;
uniform float uSoft; // жёсткость колокола: больше — компактнее пятно
void main(){
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(uv, uv);
  if(r2 >= 1.0) discard;
  // Гаусс, сдвинутый в ноль на границе спрайта — стыков квадратов не видно
  float e = exp(-uSoft);
  float g = (exp(-r2 * uSoft) - e) / (1.0 - e);
  o = vec4(vColor * g * vAmp * uOpacity, 1.0);
}`;class nt{constructor(t,o,s={}){this.gl=t,this.count=o.pos.length/4,this.opts={intensity:1,soft:2.6,minPx:1.5,maxPx:200,blend:"add",...s},nt._prog||(nt._prog=vt(t,Jn,t0,"glow")),this.prog=nt._prog,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.bufPos=bt(t,o.pos),t.bindBuffer(t.ARRAY_BUFFER,this.bufPos),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,4,t.FLOAT,!1,0,0),this.bufCol=bt(t,o.color),t.bindBuffer(t.ARRAY_BUFFER,this.bufCol),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.UNSIGNED_BYTE,!0,0,0),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null)}draw(t,o,s={}){if(o<=.002||this.count===0)return;const a=this.gl,n={...this.opts,...s},r=this.prog;a.useProgram(r.p),a.bindVertexArray(this.vao),a.enable(a.BLEND),n.blend==="dust"?a.blendFunc(a.ZERO,a.ONE_MINUS_SRC_COLOR):a.blendFunc(a.ONE,a.ONE),a.depthMask(!1);const i=t.viewportH*.5*(t.dist/t.viewR);a.uniformMatrix4fv(r.u.uVP,!1,t.vp),a.uniform3fv(r.u.uEye,t.eye),a.uniform1f(r.u.uProjScale,i),a.uniform1f(r.u.uIntensity,n.intensity),a.uniform1f(r.u.uMinPx,n.minPx),a.uniform1f(r.u.uMaxPx,n.maxPx),a.uniform1f(r.u.uSoft,n.soft),a.uniform1f(r.u.uOpacity,o),a.drawArrays(a.POINTS,0,this.count),a.depthMask(!0),a.disable(a.BLEND),a.bindVertexArray(null)}dispose(){const t=this.gl;t.deleteVertexArray(this.vao),t.deleteBuffer(this.bufPos),t.deleteBuffer(this.bufCol)}}function ft(e){const t=e.length,o=new Float32Array(t*4),s=new Uint8Array(t*4);for(let a=0;a<t;a++){const n=e[a];o[a*4]=n.x,o[a*4+1]=n.y,o[a*4+2]=n.z,o[a*4+3]=n.size,s[a*4]=Math.round(T(n.r,0,1)*255),s[a*4+1]=Math.round(T(n.g,0,1)*255),s[a*4+2]=Math.round(T(n.b,0,1)*255),s[a*4+3]=Math.round(T(n.a,0,1)*255)}return{pos:o,color:s}}function ct(e,t){return[v(1,e[0],t),v(1,e[1],t),v(1,e[2],t)]}function e0(e=909,t=6e4,o=800){const s=q(e),a=[];for(let n=0;n<t;n++){const r=o*Math.pow(s(),.62),i=s()*Math.PI*2,c=P(s)*120,l=s(),u=l<.76?.8+s()*1.2:l<.95?.3+s()*.5:-.3+s()*.6,h=ct(it(u),1.7),p=T(.09*Math.pow(s()+1e-4,-.42)*Math.pow(40/(40+r),.45),0,1);a.push({x:Math.cos(i)*r,y:c,z:Math.sin(i)*r,r:h[0],g:h[1],b:h[2],mag:Math.pow(p,1/2.2)})}return a}function o0(e=77,t=11e4){const o=q(e),s=[];let a=0;for(;s.length<t&&a++<t*12;){const n=200+5800*Math.pow(o(),.75),r=o()*Math.PI*2,i=Math.cos(r)*n,c=Math.sin(r)*n;if(o()>.34+.66*(.5+.5*(i/6e3)))continue;const l=P(o)*(110+.045*n),u=o(),h=u<.46?.58+o()*.8:u<.82?.14+o()*.44:-.3+o()*.44,p=ct(it(h),1.55),d=T(.045*Math.pow(o()+3e-4,-.42),0,.85);s.push({x:i,y:l,z:c,r:p[0],g:p[1],b:p[2],mag:Math.pow(d,1/2.2)})}return s}function s0(e=5150){const t=q(e),o=2600,s=[],a=ct(it(1.75),2);for(let n=0;n<9e3;n++){const r=t()<.1,i=P(t)*4.4*ye*(r?3.4:1),c=t()*Math.PI*2,l=.5+.5*Math.cos(c),u=Math.cos(i),h=ct(it(.78+t()*.42),1.3),p=ct(it(-.1+t()*.28),1.65),d=Math.pow(l,2.1)*(.35+.65*t());let f=[v(p[0],h[0],d),v(p[1],h[1],d),v(p[2],h[2],d)],m=(.22+.78*l*l)*(.4+.6*t());r&&(f=a,m*=.3),s.push({x:o*u*Math.cos(c),y:o*Math.sin(i),z:-o*u*Math.sin(c),size:147+t()*178,r:f[0],g:f[1],b:f[2],a:m})}return s}function a0(e=5151){const t=q(e),o=2430,s=[],a=[.48,.72,.99];for(let n=0;n<2400;n++){const r=t()*Math.PI*2,i=P(t)*1.15*ye,c=Math.cos(i),l=.25+.75*Math.pow(Math.abs(Math.sin(r*3.3+1.1)),1.6);s.push({x:o*c*Math.cos(r),y:o*Math.sin(i),z:-o*c*Math.sin(r),size:98+t()*141,r:a[0],g:a[1],b:a[2],a:l*(.35+.65*t())})}for(let n=0;n<1500;n++){const r=t()*Math.PI*2,i=P(t)*6.5*ye,c=Math.cos(i);s.push({x:o*1.02*c*Math.cos(r),y:o*1.02*Math.sin(i),z:-o*1.02*c*Math.sin(r),size:210+t()*260,r:a[0],g:a[1],b:a[2],a:.22+.38*t()})}return s}function n0(e=1936,t=27.6){const o=q(e),s=[],a=[],n=[{r:1,a:1,n:4200},{r:.74,a:.26,n:1500},{r:.46,a:.14,n:700}];for(const r of n)for(let i=0;i<r.n;i++){const c=o()*2-1,l=o()*Math.PI*2,u=Math.sqrt(Math.max(0,1-c*c)),h=t*r.r*(1+P(o)*.016),p=u*Math.cos(l)*h,d=c*h,f=u*Math.sin(l)*h;s.push({x:p,y:d,z:f,size:2+o()*1.6,r:.4,g:.68,b:1,a:r.a*(.55+.45*o())})}for(let r=0;r<2600;r++){const i=o()*2-1,c=o()*Math.PI*2,l=Math.sqrt(Math.max(0,1-i*i)),u=t*(1+P(o)*.02);a.push({x:l*Math.cos(c)*u,y:i*u,z:l*Math.sin(c)*u,r:.55,g:.8,b:1,mag:.16+.1*o()})}return{glow:s,dots:a}}function i0(e=1234,t=100){const o=q(e),s=[];for(let a=0;a<3e3;a++){const n=o()*2-1,r=o()*Math.PI*2,i=Math.sqrt(Math.max(0,1-n*n)),c=t*(.92+o()*.2)*(.72+.5*Math.abs(n));s.push({x:i*Math.cos(r)*c,y:n*c*1.25,z:i*Math.sin(r)*c,size:12+o()*14,r:.34,g:.56,b:.98,a:.35+.65*o()})}return s}const Et=[.9023,-.0438,.9362];function r0(e,t={}){const{lumFaint:o=.09,slope:s=.42,rTop:a=1e-4,d0:n=40,q:r=.45,satHi:i=1.72,satLo:c=1.38,cool:l=.06,splitLum:u=.115}=t,h=e.count,p=e.color,d=e.pos,f=new Float32Array(h*3),m=new Uint8Array(h*4),b=q(20240715),y=new Float32Array(h),x=new Array(h);for(let k=0;k<h;k++)y[k]=p[k*4+3]+b()*.98,x[k]=k;x.sort((k,w)=>y[w]-y[k]);const A=new Float64Array(h);for(let k=0;k<h;k++){const w=x[k],S=(k+.5)/h,_=Math.hypot(d[w*3],d[w*3+1],d[w*3+2]);A[w]=T(o*Math.pow(S+a,-s)*Math.pow(n/(n+_),r),0,1)}x.sort((k,w)=>A[w]-A[k]);let B=0;for(let k=0;k<h;k++){const w=x[k],S=w*4,_=k*4,F=A[w];F>=u&&(B=k+1),f[k*3]=d[w*3],f[k*3+1]=d[w*3+1],f[k*3+2]=d[w*3+2],m[_+3]=Math.round(255*Math.pow(F,1/2.2));const U=p[S]/255,I=p[S+1]/255,Y=p[S+2]/255,V=.3*U+.59*I+.11*Y,K=g(.015,.4,F),M=v(c,i,K),z=l*(1-K),R=[v(V+(U-V)*M,V*.78,z),v(V+(I-V)*M,V*.93,z),v(V+(Y-V)*M,V*1.22,z)];for(let E=0;E<3;E++)m[_+E]=Math.round(255*T(R[E],0,1))}return{...e,pos:f,color:m,bright:B}}function ls(e,t=.115){e.sort((a,n)=>n.mag-a.mag);const o=Math.pow(t,1/2.2);let s=0;for(let a=0;a<e.length;a++)e[a].mag>=o&&(s=a+1);return{data:D(e),bright:s}}const c0={id:"stars",hasCatalog:!0,async init(e){this.gl=e,this.sun=new It(e,{type:2,baseColor:[1,.93,.78],seed:.5}),this.sunSpark=new G(e,D([{x:0,y:0,z:0,r:1,g:.82,b:.48,mag:1}]),{sizeBase:2.6,sizeGain:9,brightness:.86,spikes:1,twinkle:0}),this.sunGlow=new nt(e,ft([{x:0,y:0,z:0,size:1.45,r:1,g:.74,b:.36,a:1},{x:0,y:0,z:0,size:.6,r:1,g:.86,b:.52,a:.5}]),{intensity:.052,soft:2.9,minPx:2,maxPx:420}),this.proxima=new G(e,D([{x:Et[0],y:Et[1],z:Et[2],r:1,g:.4,b:.15,mag:.94}]),{sizeBase:2.2,sizeGain:8.5,brightness:.8,spikes:.85,twinkle:.55}),this.proximaGlow=new nt(e,ft([{x:Et[0],y:Et[1],z:Et[2],size:.66,r:1,g:.26,b:.08,a:1},{x:Et[0],y:Et[1],z:Et[2],size:.24,r:1,g:.48,b:.22,a:.6}]),{intensity:.1,soft:3.2,minPx:2,maxPx:320});const t=await Os("./data/hyg.uzc");let o,s;if(t){const r=r0(t);o=r,s=r.bright,this.source=`HYG · ${t.count.toLocaleString("ru-RU")} звёзд`}else{const r=ls(e0());o=r.data,s=r.bright,this.source="процедурная замена HYG"}this.stars=new G(e,o,{sizeBase:1.6,sizeGain:13,brightness:.85,spikes:.9,twinkle:.16}),this.starsBright=s,this.starsAll=this.stars.count,this.band=new nt(e,ft(s0()),{intensity:.0048,soft:1.2,minPx:2,maxPx:260}),this.bandDust=new nt(e,ft(a0()),{intensity:.17,soft:1.35,minPx:2,maxPx:240,blend:"dust"});const a=n0();this.radio=new nt(e,ft(a.glow),{intensity:.022,soft:2.4,minPx:1.5,maxPx:120}),this.radioDots=new G(e,D(a.dots),{sizeBase:1.2,sizeGain:1,brightness:.18,spikes:0}),this.bubble=new nt(e,ft(i0()),{intensity:.016,soft:2.2,minPx:1.5,maxPx:200});const n=ls(o0(),.16);this.far=new G(e,n.data,{sizeBase:1.5,sizeGain:8,brightness:.52,spikes:.15}),this.farBright=n.bright,this.farAll=this.far.count},draw(e,t,o,s,a){const n=a>19?1-g(19.25,19.82,a):0;o=o+(1-o)*n;const r=g(16.9,17.7,a)*(1-g(19.1,19.52,a));r>.004&&(this.band.draw(t,o*r),this.bandDust.draw(t,o*r*g(17.3,18,a)));const i=g(17.55,18.05,a)*(1-g(18.6,19.2,a));i>.004&&(this.radio.draw(t,o*i),this.radioDots.draw(t,o*i*.8,s));const c=g(18.28,18.46,a)*(1-g(18.52,18.86,a));c>.004&&this.bubble.draw(t,o*c);const l=o*g(18.2,19,a);l>.004&&(this.far.draw(t,l,s,{first:this.farBright,count:this.farAll-this.farBright,sizeBase:.5,sizeGain:0,brightness:.46,spikes:0}),this.far.draw(t,l,s,{count:this.farBright})),this.stars.draw(t,o,s,{first:this.starsBright,count:this.starsAll-this.starsBright,sizeBase:.5,sizeGain:0,brightness:.92,spikes:0,twinkle:.1}),this.stars.draw(t,o,s,{count:this.starsBright});const u=Math.max(6957e5/Ie,t.viewR*.0026),h=1-g(16.6,17.4,a);h>.004&&this.sun.draw(t,[0,0,0],u,o*h,s);const p=g(16.42,16.86,a)*(1-g(17.65,18.25,a));p>.004&&(this.proximaGlow.draw(t,o*p),this.proxima.draw(t,o*p,s));const d=g(16.5,17,a)*(1-g(18.3,19,a));if(d>.004){const f=g(16.8,17.02,a)*(1-g(17.3,17.9,a));f>.004&&this.sunGlow.draw(t,o*f),this.sunSpark.draw(t,o*d,s)}}},ne=25*ye,Ne=3,us=Math.PI,mt=[Ge*Math.cos(us),.02,Ge*Math.sin(us)];function l0(e){return 1-g(20.25,20.9,e)}const bo=new Float32Array(16),Re=[0,0,0];function u0(e,t){if(t<=1e-4)return e;const o=-mt[0]*t,s=-.02*t,a=-mt[2]*t,n=e.vp;for(let r=0;r<12;r++)bo[r]=n[r];for(let r=0;r<4;r++)bo[12+r]=n[r]*o+n[4+r]*s+n[8+r]*a+n[12+r];return Re[0]=e.eye[0]-o,Re[1]=e.eye[1]-s,Re[2]=e.eye[2]-a,{...e,vp:bo,eye:Re}}const Kt=[{phase:ne,pitch:17,w:1},{phase:ne+Math.PI,pitch:17,w:.98},{phase:ne+1.75,pitch:19.5,w:.55},{phase:ne+1.75+Math.PI,pitch:19.5,w:.5}];for(const e of Kt)e.k=Math.tan(e.pitch*ye);const hs=(()=>{let e=0;return Kt.map(t=>(e+=t.w)/Kt.reduce((o,s)=>o+s.w,0))})();function Ye(e){const t=e();for(let o=0;o<hs.length;o++)if(t<=hs[o])return Kt[o];return Kt[Kt.length-1]}function jo(e,t){return Math.log(Math.max(t,.35)/Ne)/e.k+e.phase}function Ko(e,t,o,s,a=0){const n=P(e)*s+a;return jo(o,t)+n/Math.max(t,1.2)}function xe(e,t,o,s){for(let a=0;a<24;a++){const n=-t*Math.log(1-e()*.9995);if(n>=o&&n<=s)return n}return v(o,s,e())}function h0(e=3141){const t=q(e),o=[],s=[],a=ct(it(-.05),2.6),n=ct(it(.95),2.3);for(let r=0;r<62e3;r++){const i=xe(t,3.5,Ne*.75,18),c=Ye(t),l=jo(c,i);let u=P(t)*(.45+.07*i);Math.abs(Math.sin(l*3.1+c.phase*2))>.74&&t()<.5&&(u+=(.5+1.7*Math.pow(t(),1.5))*(t()<.5?1:-1));const p=l+u/Math.max(i,1.2),d=P(t)*(.11+.008*i),f=g(2.6,7,i)*(.7+.3*t()),m=[v(n[0],a[0],f),v(n[1],a[1],f),v(n[2],a[2],f)],b=.45+.55*Math.pow(Math.abs(Math.sin(p*2.7+c.phase*3.1)),.7);o.push({x:Math.cos(p)*i,y:d,z:Math.sin(p)*i,size:.55+t()*.75,r:m[0],g:m[1],b:m[2],a:c.w*b*(.5+.5*t())})}for(let r=0;r<26e3;r++){const i=xe(t,3.9,.6,19),c=t()*Math.PI*2,l=P(t)*(.16+.012*i),u=g(3.5,10,i)*.75,h=[v(n[0],a[0],u),v(n[1],a[1],u),v(n[2],a[2],u)];s.push({x:Math.cos(c)*i,y:l,z:Math.sin(c)*i,size:.85+t()*.9,r:h[0],g:h[1],b:h[2],a:.4+.6*t()})}return{arms:o,inter:s}}function p0(e=2718){const t=q(e),o=[],s=[.58,.7,.88];for(let a=0;a<26e3;a++){const n=xe(t,2.9,2,15.5),r=Ye(t),i=Ko(t,n,r,.26+.032*n,.34+.028*n),c=P(t)*.075,l=Math.pow(t(),.6);o.push({x:Math.cos(i)*n,y:c,z:Math.sin(i)*n,size:.5+t()*.75,r:s[0],g:s[1],b:s[2],a:(.3+.7*l)*r.w})}for(let a=0;a<5e3;a++){const n=3.9+P(t)*.85,r=t()*Math.PI*2;o.push({x:Math.cos(r)*n,y:P(t)*.06,z:Math.sin(r)*n,size:.55+t()*.7,r:s[0],g:s[1],b:s[2],a:.25+.45*t()})}return o}function f0(e=6563){const t=q(e),o=[],s=[];for(let a=0;a<620;a++){const n=xe(t,3.6,3.2,14),r=Ye(t),i=Ko(t,n,r,.22+.02*n,-.12),c=Math.cos(i)*n,l=Math.sin(i)*n,u=P(t)*.09,h=t()<.26,p=h?.6+t()*.7:.28+t()*.38,d=t();o.push({x:c,y:u,z:l,size:p,r:1,g:v(.4,.52,d),b:v(.5,.58,1-d),a:(h?.85:.55)*(.6+.4*t())*r.w});const f=h?22:10;for(let m=0;m<f;m++){const b=ct(it(-.28+t()*.25),1.5);s.push({x:c+P(t)*p*.4,y:u+P(t)*p*.2,z:l+P(t)*p*.4,r:b[0],g:b[1],b:b[2],mag:.45+t()*.35})}}return{glow:o,stars:s}}function d0(e=1618){const t=q(e),o=[],s=[],a=[],n=Math.cos(ne),r=Math.sin(ne),i=(l,u,h,p)=>{const d=t()*2-1,f=t()*Math.PI*2,m=Math.sqrt(Math.max(0,1-d*d)),b=m*Math.cos(f)*l*u,y=d*l*h,x=m*Math.sin(f)*l*p;return[b*n-x*r,y,b*r+x*n]},c=ct(it(1.05),1.95);for(let l=0;l<24e3;l++){const u=1.55*Math.pow(t(),1.7),[h,p,d]=i(u,2.05,.42,.78);o.push({x:h,y:p,z:d,size:.42+t()*.6,r:c[0],g:c[1]*.99,b:c[2]*.94,a:.35+.65*t()})}for(let l=0;l<1400;l++){const u=.26*Math.pow(t(),2.2),[h,p,d]=i(u,1.25,.85,1);s.push({x:h,y:p,z:d,size:.06+t()*.13,r:1,g:.94,b:.82,a:.5+.5*t()})}for(let l=0;l<68e3;l++){const u=1.7*Math.pow(t(),1.55),[h,p,d]=i(u,2.05,.44,.8),f=ct(it(.9+t()*.75),1.35);a.push({x:h,y:p,z:d,r:f[0],g:f[1],b:f[2],mag:.22+t()*.3})}return{glow:o,nucleus:s,stars:a}}function m0(e=1899){const t=q(e),o=[],s=[];for(let a=0;a<800;a++){const n=3+30*Math.pow(t(),1.5),r=t()*2-1,i=t()*Math.PI*2,c=Math.sqrt(Math.max(0,1-r*r));o.push({x:c*Math.cos(i)*n,y:r*n*.88,z:c*Math.sin(i)*n,size:6+t()*7,r:.88,g:.86,b:.95,a:.35+.65*t()})}for(let a=0;a<22e3;a++){const n=2+36*Math.pow(t(),2.2),r=t()*2-1,i=t()*Math.PI*2,c=Math.sqrt(Math.max(0,1-r*r)),l=ct(it(1+t()*.7),1.3);s.push({x:c*Math.cos(i)*n,y:r*n*.85,z:c*Math.sin(i)*n,r:l[0],g:l[1],b:l[2],mag:.1+t()*.16})}for(let a=0;a<150;a++){const n=1.5+26*Math.pow(t(),1.8),r=t()*2-1,i=t()*Math.PI*2,c=Math.sqrt(Math.max(0,1-r*r)),l=c*Math.cos(i)*n,u=r*n*.9,h=c*Math.sin(i)*n,p=.05+t()*.07;o.push({x:l,y:u,z:h,size:p*4.5,r:1,g:.93,b:.8,a:.5+.5*t()});for(let d=0;d<80;d++){const f=ct(it(.85+t()*.6),1.3),m=Math.pow(t(),2.2),b=t()*2-1,y=t()*Math.PI*2,x=Math.sqrt(Math.max(0,1-b*b));s.push({x:l+x*Math.cos(y)*p*m*3,y:u+b*p*m*3,z:h+x*Math.sin(y)*p*m*3,r:f[0],g:f[1],b:f[2],mag:.18+t()*.22})}}return{glow:o,stars:s}}const v0=[{name:"Большое Магелланово Облако",d:49.97,dir:[.55,-.72,.42],n:2e4,size:4.5,color:.25,hii:!0},{name:"Малое Магелланово Облако",d:61,dir:[.42,-.83,.36],n:9e3,size:2.6,color:.4},{name:"Карлик в Стрельце",d:20,dir:[-.15,-.55,.82],n:4500,size:3,color:.95}];function b0(e=4242){const t=q(e),o=[],s=[];for(const a of v0){const n=[...a.dir],r=Math.hypot(n[0],n[1],n[2]);n[0]/=r,n[1]/=r,n[2]/=r;const i=n[0]*a.d,c=n[1]*a.d,l=n[2]*a.d;for(let u=0;u<a.n;u++){const h=ct(it(a.color+t()*.7),1.35);o.push({x:i+P(t)*a.size,y:c+P(t)*a.size*.7,z:l+P(t)*a.size,r:h[0],g:h[1],b:h[2],mag:.13+t()*.26})}for(let u=0;u<260;u++){const h=ct(it(a.color+.3),1.2);s.push({x:i+P(t)*a.size,y:c+P(t)*a.size*.7,z:l+P(t)*a.size,size:a.size*.55,r:h[0],g:h[1],b:h[2],a:.4+.6*t()})}if(a.hii)for(let u=0;u<26;u++)s.push({x:i+a.size*.6+P(t)*.5,y:c+P(t)*.35,z:l-a.size*.35+P(t)*.5,size:.5+t()*.7,r:1,g:.44,b:.54,a:.5+.5*t()})}return{stars:o,glow:s}}function g0(e=2024){const t=q(e),o=[],s=1.9;for(let a=0;a<21e4;a++){const n=xe(t,3,Ne*.6,17),r=t()<(n>Ne?.78:.25);let i;if(r){const p=Ye(t);i=Ko(t,n,p,.4+.06*n)}else i=t()*Math.PI*2;const c=P(t)*(.13+.011*n),l=r&&t()<.5,u=l?-.28+t()*.45:.55+t()*1.05,h=ct(it(u),l?s:1.3);o.push({x:Math.cos(i)*n,y:c,z:Math.sin(i)*n,r:h[0],g:h[1],b:h[2],mag:l?.36+t()*.3:.2+t()*.24})}return o}function Us(e,t){let o=0;for(const s of Kt){let a=t-jo(s,e);a=((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;const n=a*e,r=.45+.07*e;o=Math.max(o,s.w*Math.exp(-(n*n)/(2*r*r)))}return o}function y0(e=8178,t=115e3,o=5.4){const s=q(e),a=[];let n=0;for(;a.length<t&&n++<t*24;){const r=o*Math.sqrt(s()),i=s()*Math.PI*2,c=mt[0]+r*Math.cos(i),l=mt[2]+r*Math.sin(i),u=Math.hypot(c,l);if(u<1.2||u>17)continue;const h=Math.atan2(l,c),p=Us(u,h),f=(1-g(.62,1,r/o))*Math.exp((Ge-u)/3)*(.3+.7*p);if(s()>Math.min(1,f))continue;const m=mt[1]+P(s)*(.13+.011*u),b=s()<.22+.42*p,y=b?-.26+s()*.45:.55+s()*1.05,x=ct(it(y),b?1.9:1.3),A=Math.hypot(c-mt[0],m-mt[1],l-mt[2]),B=Math.pow(1.1/(1.1+A),.5);a.push({x:c,y:m,z:l,r:x[0],g:x[1],b:x[2],mag:T((b?.4+s()*.34:.22+s()*.26)*(.55+.75*B),0,1)})}return a}function x0(e=8179,t=9e3,o=5.4){const s=q(e),a=[],n=ct(it(-.05),2.6),r=ct(it(.95),2.3);let i=0;for(;a.length<t&&i++<t*30;){const c=o*Math.sqrt(s()),l=s()*Math.PI*2,u=mt[0]+c*Math.cos(l),h=mt[2]+c*Math.sin(l),p=Math.hypot(u,h);if(p<1.2||p>17)continue;const d=Math.atan2(h,u),f=Us(p,d),b=(1-g(.62,1,c/o))*Math.exp((Ge-p)/3)*(.14+.86*f);if(s()>Math.min(1,b))continue;const y=mt[1]+P(s)*.1,x=f*(.55+.45*s());a.push({x:u,y,z:h,size:.1+s()*.22,r:v(r[0],n[0],x),g:v(r[1],n[1],x),b:v(r[2],n[2],x),a:(.3+.7*f)*(.4+.6*s())})}return a}function M0(e){const t=g(19.25,19.82,e);return{glow:t*v(.009,1,g(19.9,20.55,e)),stars:t*v(.62,1,g(19.82,20.45,e)),close:t*(1-g(20,20.55,e)),local:g(19.05,19.7,e)*(1-g(20.15,20.7,e))}}const w0={id:"galaxy",init(e){const{arms:t,inter:o}=h0(),s=d0(),a=m0(),n=f0(),r=b0();this.gArms=new nt(e,ft(t),{intensity:.056,soft:2.5,minPx:1.5,maxPx:220}),this.gInter=new nt(e,ft(o),{intensity:.022,soft:2.2,minPx:1.5,maxPx:220}),this.gBulge=new nt(e,ft(s.glow),{intensity:.0032,soft:2.4,minPx:1.5,maxPx:220}),this.gNucleus=new nt(e,ft(s.nucleus),{intensity:.0055,soft:2.6,minPx:1.5,maxPx:160}),this.gHalo=new nt(e,ft(a.glow),{intensity:.0016,soft:2,minPx:1.5,maxPx:260}),this.gHII=new nt(e,ft(n.glow),{intensity:1.25,soft:2.7,minPx:2,maxPx:200}),this.gSat=new nt(e,ft(r.glow),{intensity:.006,soft:2.2,minPx:1.5,maxPx:220}),this.dust=new nt(e,ft(p0()),{intensity:.135,soft:2.3,minPx:1.5,maxPx:200,blend:"dust"}),this.sDisk=new G(e,D(g0()),{sizeBase:1,sizeGain:2.6,brightness:.24,spikes:0}),this.sBulge=new G(e,D(s.stars),{sizeBase:1,sizeGain:1.8,brightness:.14,spikes:0}),this.sHalo=new G(e,D(a.stars),{sizeBase:1.05,sizeGain:2.2,brightness:.26,spikes:0}),this.sHII=new G(e,D(n.stars),{sizeBase:1.15,sizeGain:3,brightness:.32,spikes:0}),this.sSat=new G(e,D(r.stars),{sizeBase:1,sizeGain:2.4,brightness:.3,spikes:0}),this.sLocal=new G(e,D(y0()),{sizeBase:1.1,sizeGain:3.4,brightness:.42,spikes:0,twinkle:.1}),this.gLocal=new nt(e,ft(x0()),{intensity:.018,soft:2.4,minPx:1.5,maxPx:180}),this.sunMark=new G(e,D([{x:mt[0],y:mt[1],z:mt[2],r:1,g:.9,b:.62,mag:1}]),{sizeBase:2.6,sizeGain:9,brightness:1.1,spikes:1,twinkle:1.2})},draw(e,t,o,s,a){const n=M0(a);t=u0(t,l0(a));const r=o*n.glow,i=o*n.stars;if(i<=.003)return;this.gHalo.draw(t,r),this.gSat.draw(t,r),this.gInter.draw(t,r),this.gArms.draw(t,r),this.gBulge.draw(t,r),this.gNucleus.draw(t,r),this.gLocal.draw(t,o*n.local),this.dust.draw(t,r),this.gHII.draw(t,r),this.sHalo.draw(t,i,s),this.sDisk.draw(t,i,s),this.sBulge.draw(t,i,s),this.sHII.draw(t,i,s),this.sSat.draw(t,i,s);const c=o*n.close,l={sizeBase:.5,sizeGain:0,spikes:0};c>.004&&(this.sDisk.draw(t,c,s,{...l,brightness:.9}),this.sBulge.draw(t,c,s,{...l,brightness:.55}),this.sHII.draw(t,c,s,{...l,brightness:1.1}));const u=o*n.local;u>.004&&(this.sLocal.draw(t,u,s,{...l,brightness:.72}),this.sLocal.draw(t,u,s));const h=1-g(20.6,21.4,a);h>.004&&this.sunMark.draw(t,i*h,s)}},Ee=Math.PI/180;function Is(e,t,o){const s=Math.cos(t*Ee),a=Math.sin(t*Ee),n=Math.cos(e*Ee),r=Math.sin(e*Ee);return[o*s*n,o*a,-o*s*r]}function z0(e,t){return[T(1+(e[0]-1)*t,0,1),T(1+(e[1]-1)*t,0,1),T(1+(e[2]-1)*t,0,1)]}function se(e,t=1.55){return z0(it(e),t)}function Gs(e){const t=Math.hypot(e[0],e[1],e[2])||1,o=[e[0]/t,e[1]/t,e[2]/t],s=Math.abs(o[1])<.9?[0,1,0]:[1,0,0];let a=[s[1]*o[2]-s[2]*o[1],s[2]*o[0]-s[0]*o[2],s[0]*o[1]-s[1]*o[0]];const n=Math.hypot(a[0],a[1],a[2])||1;a=[a[0]/n,a[1]/n,a[2]/n];const r=[o[1]*a[2]-o[2]*a[1],o[2]*a[0]-o[0]*a[2],o[0]*a[1]-o[1]*a[0]];return[a,r,o]}function A0(e){const t=e()*2-1,o=e()*Math.PI*2,s=Math.sqrt(1-t*t);return[s*Math.cos(o),t,s*Math.sin(o)]}function De(e,t,o,s=null){const a=e.length;for(let n=0;n<a;n+=t){const r=s?Math.min(a-1,n+Math.floor(s()*t)):n,i=e[r];e.push({x:i.x,y:i.y,z:i.z,r:i.r,g:i.g,b:i.b,mag:i.mag*o})}return a}function Ft(e,t,[o,s,a],n,r,i,c={}){const{br:l=1,satK:u=1.55,arms:h=2,hiiKnots:p=0}=c,[d,f,m]=Gs(c.normal||A0(e)),b=(w,S,_,F,U)=>{t.push({x:o+d[0]*w+f[0]*_+m[0]*S,y:s+d[1]*w+f[1]*_+m[1]*S,z:a+d[2]*w+f[2]*_+m[2]*S,r:F[0],g:F[1],b:F[2],mag:T(U*l,0,1)})};if(i==="elliptical"||i==="smudge"){const w=i==="smudge";for(let S=0;S<r;S++){const _=Math.abs(P(e))*n*(w?.55:.42),F=e()*2-1,U=e()*Math.PI*2,I=Math.sqrt(1-F*F),Y=1-g(0,n*.5,_),V=se(w?.75+e()*.5:1.05+e()*.55,u);b(I*Math.cos(U)*_,F*_*.78,I*Math.sin(U)*_,V,(w?.09:.13)+(w?.06:.2)*Y+.07*e())}return}if(i==="irregular"){const w=3+Math.floor(e()*3),S=[];for(let _=0;_<w;_++)S.push([P(e)*n*.42,P(e)*n*.1,P(e)*n*.42,.5+e()]);for(let _=0;_<r;_++){const F=S[Math.floor(e()*S.length)],U=n*(.16+.22*e()),I=F[0]+P(e)*U,Y=F[1]+P(e)*n*.11,V=F[2]+P(e)*U;let K,M;e()<.1?(K=[1,.52+.12*e(),.6+.14*e()],M=.16+.16*e()):e()<.55?(K=se(-.05+e()*.35,u),M=.11+.16*e()):(K=se(.65+e()*.55,u),M=.09+.14*e()),b(I,Y,V,K,M*F[3])}return}const y=Math.floor(r*.13);for(let w=0;w<y;w++){const S=Math.abs(P(e))*n*.38,_=e()*2-1,F=e()*Math.PI*2,U=Math.sqrt(1-_*_),I=1-g(0,n*.52,S);b(U*Math.cos(F)*S,_*S*.6,U*Math.sin(F)*S,se(1.45+e()*.55,u*1.15),.15+.11*I+.05*e())}const x=.34,A=n*.05,B=r-y;for(let w=0;w<B;w++){const S=-Math.log(1-e()*.99)*n*.4;if(S>n*1.08)continue;const _=e()<.22,F=.2+.34*(S/n),U=_?e()*Math.PI*2:Math.log(Math.max(S,A)/A)/x+Math.floor(e()*h)*2*Math.PI/h+P(e)*F,I=Math.cos(U)*S,Y=Math.sin(U)*S,V=P(e)*n*.03,K=!_&&e()<.85,M=K?se(-.33+e()*.26,u):se(1.05+e()*.75,u*1.12),z=.8+.45*(S/n);b(I,V,Y,M,(K?.15:.12)+.17*e()*z+.06*z)}const k=Math.max(40,Math.round(r*.0016));for(let w=0;w<p;w++){const S=n*(.22+.74*Math.pow(e(),.75)),_=Math.log(Math.max(S,A)/A)/x+Math.floor(e()*h)*2*Math.PI/h+P(e)*.14,F=Math.cos(_)*S,U=Math.sin(_)*S,I=n*(.055+.055*e()),Y=.7+.6*e();for(let V=0;V<k;V++){const K=[1,.46+.14*e(),.56+.16*e()];b(F+P(e)*I,P(e)*n*.012,U+P(e)*I,K,(.14+.14*e())*Y)}}}const pe=8.3,k0=937;function Pe(e,t,o=2.5,s=24,a=900){const n=e/t*k0;return T(Math.round(o*Math.PI*n*n),s,a)}const S0=[{name:"Млечный Путь",l:0,b:0,d:0,R:.375,type:"spiral",n:52e3,br:.72,arms:4,hii:20,normal:[0,1,0]},{name:"Андромеда (M31)",l:121.2,b:-21.6,d:.78,R:.465,type:"spiral",n:74e3,br:.95,arms:2,hii:26,normal:[-.688,.05,.722]},{name:"Треугольник (M33)",l:133.6,b:-31.3,d:.86,R:.215,type:"spiral",n:2e4,br:.7,arms:2,hii:12,normal:[.139,-.585,.799]},{name:"БМО",l:280.5,b:-32.9,d:.34,R:.105,type:"irregular",n:4600,br:.92},{name:"ММО",l:302.8,b:-44.3,d:.42,R:.063,type:"irregular",n:2e3,br:.78},{name:"NGC 6822",l:25.3,b:-18.4,d:.5,R:.04,type:"irregular",n:1e3,br:.58},{name:"IC 10",l:119,b:-3.3,d:.79,R:.037,type:"irregular",n:900,br:.58},{name:"NGC 3109",l:262.1,b:23.1,d:1.3,R:.048,type:"irregular",n:1100,br:.5},{name:"NGC 6946",l:95.7,b:11.7,d:1.55,R:.112,type:"spiral",n:6e3,br:.46,arms:3,hii:6}],T0={id:"group",init(e){const t=q(31337),o=[];let s=null;for(const i of S0){const c=Is(i.l,i.b,i.d);i.name.startsWith("Андромеда")&&(s=c),Ft(t,o,c,i.R,i.n,i.type,{br:i.br,arms:i.arms,hiiKnots:i.hii,normal:i.normal,satK:1.85})}s&&(Ft(t,o,[s[0]+.44,s[1]-.14,s[2]+.07],.048,Pe(.048,pe,6,40,2600),"elliptical",{br:.5,satK:1.35}),Ft(t,o,[s[0]-.36,s[1]+.23,s[2]-.12],.06,Pe(.06,pe,6,40,2400),"elliptical",{br:.4,satK:1.35})),this.nMain=De(o,3,.34,t),this.pts=new G(e,D(o),{sizeBase:2.4,sizeGain:1.1,brightness:2.2,spikes:0});const a=[];for(let i=0;i<70;i++){const c=t()*2-1,l=t()*Math.PI*2,u=Math.sqrt(1-c*c),h=.35+t()*2.3,p=.022+t()*.038;Ft(t,a,[u*Math.cos(l)*h,c*h*.8,u*Math.sin(l)*h],p,Pe(p,Math.hypot(pe,h),3,24,300),"smudge",{br:.55,satK:1.15})}this.dw=new G(e,D(a),{sizeBase:3.2,sizeGain:.8,brightness:6.2,spikes:0});const n=[],r=[];for(let i=0;i<200;i++){const c=t()*2-1,l=t()*Math.PI*2,u=Math.sqrt(1-c*c),h=5+t()*25,p=[u*Math.cos(l)*h,c*h*.9,u*Math.sin(l)*h],d=Math.hypot(pe,h),f=.95*Math.pow(6/d,1.5),m=.35+t()*1.5,b=2+Math.floor(Math.pow(t(),1.4)*6);for(let x=0;x<b;x++){const A=[p[0]+P(t)*m,p[1]+P(t)*m*.8,p[2]+P(t)*m],B=.045+t()*.11*(x===0?1.6:1),k=h<12?t()<.55?"spiral":t()<.75?"elliptical":"irregular":t()<.5?"smudge":"elliptical";Ft(t,n,A,B,Pe(B,d,2.2,12,520),k,{br:f*(x===0?1.25:.85),satK:1.45,arms:2,hiiKnots:0})}const y=m*2.4+.5;for(let x=0;x<90;x++){const A=t()*2-1,B=t()*Math.PI*2,k=Math.sqrt(1-A*A),w=Math.abs(P(t))*y,S=t()<.35;r.push({x:p[0]+k*Math.cos(B)*w,y:p[1]+A*w*.8,z:p[2]+k*Math.sin(B)*w,r:S?.95:.54,g:S?.78:.68,b:S?.58:.98,mag:T((.36+.1*t())*Math.pow(f,.5),0,1)})}}for(let i=0;i<22e3;i++){const c=t()*2-1,l=t()*Math.PI*2,u=Math.sqrt(1-c*c),h=5+30*Math.pow(t(),.6),p=Math.pow(11/Math.hypot(pe,h),.85);r.push({x:u*Math.cos(l)*h,y:c*h*.9,z:u*Math.sin(l)*h,r:.6,g:.7,b:.94,mag:T((.2+.06*t())*p,0,1)})}this.hz=new G(e,D(r),{sizeBase:46,sizeGain:.4,brightness:.9,spikes:0}),this.bgMain=De(n,9,.48,t),this.bg=new G(e,D(n),{sizeBase:2,sizeGain:1.1,brightness:6.6,spikes:0})},draw(e,t,o,s,a){const r=o*T(Math.pow(10,-.62*(a-23)),.3,2.3)*g(21.82,22.4,a),i=o*g(22.05,22.75,a);this.hz.draw(t,i*.9,s),this.bg.draw(t,i,s,{count:this.bgMain}),this.bg.draw(t,i,s,{first:this.bgMain,count:this.bg.count-this.bgMain,sizeBase:4.2,sizeGain:.8}),this.dw.draw(t,r,s),this.pts.draw(t,r,s,{count:this.nMain}),this.pts.draw(t,r,s,{first:this.nMain,count:this.pts.count-this.nMain,sizeBase:5.4,sizeGain:.5,brightness:15.5})}},Tt=Is(307,9,65);function R0(e,t,o,{count:s=300,rInner:a=22,rOuter:n=200,segs:r=6,span:i=.24}){const c=q(t),l=[],u=[],[h,p,d]=o;for(let f=0;f<s;f++){const m=c()*2-1,b=c()*Math.PI*2,y=Math.sqrt(1-m*m),x=v(a,n,Math.pow(c(),1.35)),A=y*Math.cos(b)*x,B=m*x*.85,k=y*Math.sin(b)*x;let w=p*k-d*B,S=d*A-h*k,_=h*B-p*A;const F=Math.hypot(w,S,_)||1;w/=F,S/=F,_/=F;const U=(c()-.5)*x*.1,I=c()*(1-i)*.75;let Y=0,V=0,K=0;for(let M=0;M<=r;M++){const z=I+M/r*i,R=Math.sin(Math.PI*z)*U,E=v(A,h,z)+w*R,C=v(B,p,z)+S*R,L=v(k,d,z)+_*R;M>0&&(l.push(Y,V,K,E,C,L),u.push((M-1)/r,M/r)),Y=E,V=C,K=L}}return new Ss(e,new Float32Array(l),new Float32Array(u),"lines")}function E0(e){const{pos:t,color:o,count:s}=e,a=52,n=260,r=2*n/a,i=new Uint16Array(a*a*a),c=m=>{const b=T(Math.floor((t[m*3]+n)/r),0,a-1),y=T(Math.floor((t[m*3+1]+n)/r),0,a-1),x=T(Math.floor((t[m*3+2]+n)/r),0,a-1);return(b*a+y)*a+x};for(let m=0;m<s;m++)i[c(m)]++;const l=14,u=20,h=Array.from({length:l},()=>[]);for(let m=0;m<a;m++)for(let b=0;b<a;b++)for(let y=0;y<a;y++){const x=i[(m*a+b)*a+y];if(!x)continue;const A=(m+.5)*r-n,B=(b+.5)*r-n,k=(y+.5)*r-n;h[T(Math.floor(Math.hypot(A,B,k)/u),0,l-1)].push(x)}const p=h.map(m=>m.length?(m.sort((b,y)=>b-y),Math.max(1.5,m[Math.floor(m.length*.93)]*1)):1),d=[.4,.6,1],f=[1,.76,.44];for(let m=0;m<s;m++){const b=m*4,y=o[b]/255,x=o[b+1]/255,A=o[b+2]/255,B=Math.hypot(t[m*3],t[m*3+1],t[m*3+2]),k=T(Math.floor(B/u),0,l-1),w=T(i[c(m)]/p[k],0,1),S=g(.3,.95,w),_=.3*y+.6*x+.1*A;for(let I=0;I<3;I++){const Y=v(d[I],f[I],S),V=v(_,[y,x,A][I],.3);o[b+I]=Math.round(T(v(Y,V,.1),0,1)*255)}const F=.48+.52*g(5,45,B),U=1+.55*(1-S);o[b+3]=Math.round(T(Math.pow(o[b+3]/255,1.18)*F*U,0,1)*255)}return e}const P0={id:"supercluster",hasCatalog:!0,async init(e){const t=await Os("./data/2mrs.uzc"),o={sizeBase:1.35,sizeGain:1.2,brightness:2.3,spikes:0};t?(this.pts=new G(e,E0(t),o),this.source=`2MRS · ${t.count.toLocaleString("ru-RU")} галактик`):(this.pts=new G(e,D(Ns(2024,200,11,14e4,{fieldFrac:.1})),o),this.source="процедурная замена 2MRS");const s=[],a=q(51423);for(let h=0;h<4200;h++){const p=a()*2-1,d=a()*Math.PI*2,f=Math.sqrt(1-p*p),m=170+620*Math.pow(a(),.55),b=.55*Math.pow(200/m,1.5);Ft(a,s,[f*Math.cos(d)*m,p*m,f*Math.sin(d)*m],1.2+a()*2.4,26,a()<.5?"elliptical":"irregular",{br:b,satK:1.7})}this.farField=new G(e,D(s),{sizeBase:1.5,sizeGain:1.6,brightness:1.9,spikes:0});const n=q(90210),r=[];for(let h=0;h<60;h++){const p=Math.abs(P(n))*11,d=n()*2-1,f=n()*Math.PI*2,m=Math.sqrt(1-d*d),b=[Tt[0]+m*Math.cos(f)*p,Tt[1]+d*p*.8,Tt[2]+m*Math.sin(f)*p];Ft(n,r,b,2+n()*2.8,320,n()<.6?"elliptical":"spiral",{br:1.05-.06*(p/11),satK:1.7,arms:2})}const i=Math.hypot(Tt[0],Tt[1],Tt[2]),c=[Tt[0]/i,Tt[1]/i,Tt[2]/i],[l,u]=Gs(c);for(let h=0;h<300;h++){const p=.22+1.9*Math.pow(n(),.8),d=11*(.3+Math.abs(p-1)*1),f=P(n)*d,m=P(n)*d*.7,b=[i*p*c[0]+l[0]*f+u[0]*m,i*p*c[1]+l[1]*f+u[1]*m,i*p*c[2]+l[2]*f+u[2]*m],y=1-g(.3,1.5,Math.abs(p-1)*1.6);Ft(n,r,b,1.8+n()*3,220,n()<.35+.4*y?"elliptical":"spiral",{br:.42+.55*y,satK:1.7,arms:2})}this.knotMain=De(r,10,.5),this.knot=new G(e,D(r),{sizeBase:1.6,sizeGain:2.6,brightness:1.3,spikes:0}),this.flows=R0(e,606,Tt,{count:210})},draw(e,t,o,s,a){const n=o*(1+2.1*(1-g(23.3,24.45,a)));this.farField.draw(t,o*g(23.9,24.5,a),s),this.pts.draw(t,n,s),this.pts.draw(t,n*.45,s,{sizeBase:5,sizeGain:.8});const r=o*g(23.65,24.3,a)*(1-g(24.95,25.45,a));r>.004&&(this.knot.draw(t,r,s,{count:this.knotMain}),this.knot.draw(t,r,s,{first:this.knotMain,count:this.knot.count-this.knotMain,sizeBase:6,sizeGain:1.2}),this.flows.draw(t,r*.045,[.42,.56,.92],{head:.92,falloff:2}))}};function Ns(e,t,o,s,a={}){const{fieldFrac:n=.08,nodeFrac:r=.17,dim:i=.32,redshift:c=.55}=a,l=q(e),u=2*t/o,h=[],p=new Int32Array(o*o*o).fill(-1);for(let w=0;w<o;w++)for(let S=0;S<o;S++)for(let _=0;_<o;_++){const F=(w+.5+(l()-.5)*.8)*u-t,U=(S+.5+(l()-.5)*.8)*u-t,I=(_+.5+(l()-.5)*.8)*u-t;Math.hypot(F,U,I)>t*1.02||(p[(w*o+S)*o+_]=h.length,h.push({x:F,y:U,z:I,m:Math.pow(l(),2.4)}))}const d=[],f=(w,S,_)=>w<o&&S<o&&_<o?p[(w*o+S)*o+_]:-1;for(let w=0;w<o;w++)for(let S=0;S<o;S++)for(let _=0;_<o;_++){const F=f(w,S,_);if(!(F<0))for(const[U,I,Y,V]of[[1,0,0,.72],[0,1,0,.72],[0,0,1,.72],[1,1,0,.16],[0,1,1,.16],[1,0,1,.16]]){const K=f(w+U,S+I,_+Y);K<0||l()>V||d.push(F,K)}}const m=[],b=(w,S,_,F,U)=>{const I=T(Math.hypot(w,S,_)/t,0,1),Y=Math.pow(I,2)*c,V=[v(F[0],1,Y),v(F[1],.5,Y),v(F[2],.26,Y)],K=1-g(.93,1,I);m.push({x:w,y:S,z:_,r:V[0],g:V[1],b:V[2],mag:T(U*v(1,i,Math.pow(I,1.4))*K,0,1)})},y=Math.round(s*(1-r-n)),x=Math.max(1,Math.floor(y/Math.max(1,d.length/2)));for(let w=0;w<d.length;w+=2){const S=h[d[w]],_=h[d[w+1]],F=u*.052*(.6+.9*(S.m+_.m));for(let U=0;U<x;U++){const I=l(),Y=F*(.55+1.5*Math.abs(I-.5)),V=v(S.x,_.x,I)+P(l)*Y,K=v(S.y,_.y,I)+P(l)*Y,M=v(S.z,_.z,I)+P(l)*Y;if(Math.hypot(V,K,M)>t)continue;const R=l()<.9?[.14+.12*l(),.38+.16*l(),1]:[.86,.84,.86];b(V,K,M,R,.3+.16*l())}}const A=Math.round(s*r),B=h.reduce((w,S)=>w+S.m+.05,0);for(const w of h){const S=Math.round(A*(w.m+.05)/B),_=u*(.1+.16*w.m);for(let F=0;F<S;F++){const U=Math.abs(P(l))*_,I=l()*2-1,Y=l()*Math.PI*2,V=Math.sqrt(1-I*I),K=w.x+V*Math.cos(Y)*U,M=w.y+I*U,z=w.z+V*Math.sin(Y)*U;if(Math.hypot(K,M,z)>t)continue;const R=1-g(0,_*1.6,U),E=[1,.64+.12*l(),.26+.16*l()];b(K,M,z,E,.28+.2*R+.07*l())}}const k=Math.round(s*n);for(let w=0;w<k;w++){const S=l()*2-1,_=l()*Math.PI*2,F=Math.sqrt(1-S*S),U=t*Math.cbrt(l());b(F*Math.cos(_)*U,S*U,F*Math.sin(_)*U,[.55,.68,.95],.11+.08*l())}return m}const _0=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform float uAmount;
uniform vec2 uRes;
${Oo}
void main(){
  vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec3 dir = normalize(vec3(p, 0.62));
  // Кромка не идеально круглая: реальная граница видимости размыта эпохой
  // рекомбинации, да и ровная окружность выглядит наклейкой
  float wob = 1.0 + 0.05 * (fbm(dir * 6.0, 3) - 0.5);
  // Множитель 2,28 вместо 2,0 подтягивает кольцо внутрь кадра: при 2,0 оно
  // приходилось ровно на верхний и нижний край, и половина бублика оставалась
  // за экраном — в финальном кадре, который держится на экране шесть секунд.
  float r = length(p) * 2.28 / wob;
  // ВНУТРЕННЯЯ КРОМКА. Раньше свечение обрывалось на r=0,93 ступенькой, и
  // реликт читался наклейкой-бубликом с прорисованным контуром. Теперь внутрь
  // уходит широкий степенной градиент: он нигде не имеет края, гаснет к
  // середине кадра и заодно закрывает чёрную канаву между паутиной и кольцом.
  float inner = pow(clamp(r / 1.02, 0.0, 1.0), 1.9);
  float rim = smoothstep(0.82, 1.01, r) * 0.58;
  float outer = 1.0 - smoothstep(1.03, 1.24, r);
  float glow = (inner * 0.50 + rim) * outer;
  // Флуктуации ΔT/T ≈ 10⁻⁵ — усилены на порядки, иначе на экране ровный фон
  float f = fbm(dir * 21.0, 5) - 0.5;
  f += 0.55 * (fbm(dir * 52.0, 4) - 0.5);
  f += 0.22 * (fbm(dir * 128.0, 3) - 0.5);
  float q = clamp(f * 1.35 + 0.5, 0.0, 1.0);
  // Пятна холодного и тёплого стали ближе друг к другу: реликт — это фон
  // Вселенной, а не сине-оранжевая мишень
  vec3 cold = vec3(0.40, 0.52, 0.86);
  vec3 warm = vec3(0.94, 0.72, 0.50);
  vec3 c = mix(cold, warm, q);
  c *= mix(0.84, 1.10, q); // тёплые пики чуть ярче — кольцо не полосатое
  o = vec4(c * glow * uAmount, 1.0);
}`,B0={id:"cosmicweb",init(e){this.gl=e;const t=(s,a,n,r,i,c)=>{const l=Ns(s,a,n,r,i),u=De(l,6,.52),h=new G(e,D(l),c);return h.main=u,h},o={sizeBase:1.9,sizeGain:2.2,spikes:0};this.near=t(4041,.6,10,12e4,{dim:.62,redshift:.12},{...o,brightness:5.6}),this.mid=t(777,3.6,11,2e5,{dim:.7,redshift:.2},{...o,brightness:8.5}),this.far=t(1618,21,14,28e4,{dim:.8,redshift:.22},{...o,brightness:7.6}),this.cmb=fe(e,_0,"cmb"),this.vao=e.createVertexArray()},layer(e,t,o,s){o<=.003||(e.draw(t,o,s,{count:e.main}),e.draw(t,o,s,{first:e.main,count:e.count-e.main,sizeBase:7,sizeGain:1.2}))},draw(e,t,o,s,a){const n=g(26.55,26.92,a)*o;n>.004&&(e.bindVertexArray(this.vao),e.useProgram(this.cmb.p),e.uniform1f(this.cmb.u.uAmount,n*.075),e.uniform2f(this.cmb.u.uRes,t.viewportW,t.viewportH),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.depthMask(!1),de(e),e.depthMask(!0),e.disable(e.BLEND),e.bindVertexArray(null));const r=1-g(25.3,25.9,a),i=g(25.2,25.8,a)*(1-g(26.1,26.7,a)),c=g(26.05,26.7,a);this.layer(this.far,t,o*c,s),this.layer(this.mid,t,o*i,s),this.layer(this.near,t,o*r,s)}},C0={human:pn,earth:dn,moon:xn,inner:jn,outer:Kn,oort:Xn,stars:c0,galaxy:w0,group:T0,supercluster:P0,cosmicweb:B0};class F0{constructor(t,o){this.gl=t,this.renderer=o,this.camera=new Ca,this.impls=new Map,this.ready=!1,this.sources=[]}async init(t=()=>{}){const o=ko.map(a=>({shell:a,impl:C0[a.id]})).filter(a=>a.impl);let s=0;for(const{shell:a,impl:n}of o)await n.init(this.gl,a),this.impls.set(a.id,n),n.source&&this.sources.push(n.source),s++,t(s/o.length,a.id),await new Promise(r=>setTimeout(r,0));this.ready=!0}draw(t,o){const s=this.gl,a=this.camera;a.L=t;const n=Go(t);if(n.sort((i,c)=>c.shell.unit-i.shell.unit),this._ka=(this._ka||0)+1,this._ka%60===0){s.colorMask(!1,!1,!1,!1);for(const i of ko){const c=this.impls.get(i.id);if(!c||!c.hasCatalog||n.some(u=>u.shell.id===i.id))continue;const l=a.matricesFor(i);this.renderer.clearDepth(),c.draw(s,{vp:l.vp,eye:l.eye,viewR:l.viewR,dist:l.dist,near:l.near,far:l.far,pixelScale:this.renderer.h/1080,viewportW:this.renderer.w,viewportH:this.renderer.h},.004,o,t)}s.colorMask(!0,!0,!0,!0)}const r=this.renderer.h/1080;for(const{shell:i,w:c}of n){const l=this.impls.get(i.id);if(!l||c<=.002)continue;const u=a.matricesFor(i),h={vp:u.vp,eye:u.eye,viewR:u.viewR,dist:u.dist,near:u.near,far:u.far,pixelScale:r,viewportW:this.renderer.w,viewportH:this.renderer.h};this.renderer.clearDepth(),s.bindVertexArray(null),l.draw(s,h,c,o,t)}return n}}const qt=8,L0=.55;function O0(e,t=4.2,o=3.2){const s=e.sampleRate,a=Math.floor(s*t),n=e.createBuffer(2,a,s);let r=49734321;const i=()=>(r=r*1664525+1013904223>>>0)/4294967296*2-1;for(let c=0;c<2;c++){const l=n.getChannelData(c);for(let u=0;u<a;u++){const h=u/a,p=Math.pow(1-h,o)*(u<s*.02?u/(s*.02):1);l[u]=i()*p}}return n}function U0(e,t=6){const o=Math.floor(e.sampleRate*t),s=e.createBuffer(1,o,e.sampleRate),a=s.getChannelData(0);let n=2654435761;const r=()=>(n=n*1664525+1013904223>>>0)/4294967296*2-1;let i=0,c=0,l=0;for(let u=0;u<o;u++){const h=r();i=.99765*i+h*.099046,c=.963*c+h*.2965164,l=.57*l+h*1.0526913,a[u]=(i+c+l+h*.1848)*.22}return s}const I0={human:{type:"warm",base:110,q:.9,gain:.3},earth:{type:"air",base:320,q:.7,gain:.26},moon:{type:"air",base:220,q:1.2,gain:.22},inner:{type:"pad",base:146.8,q:1,gain:.26},outer:{type:"pad",base:110,q:1.4,gain:.24},oort:{type:"glass",base:880,q:3,gain:.16},stars:{type:"glass",base:1320,q:4,gain:.18},galaxy:{type:"choir",base:82.4,q:1.2,gain:.3},group:{type:"choir",base:61.7,q:1,gain:.28},supercluster:{type:"deep",base:41.2,q:.8,gain:.3},cosmicweb:{type:"deep",base:27.5,q:.6,gain:.34}};class G0{constructor(t){this.ctx=t,this.offline=typeof OfflineAudioContext<"u"&&t instanceof OfflineAudioContext,this.nodes={},this._lastL=null,this._build()}_build(){const t=this.ctx,o=t.currentTime,s=t.createGain();s.gain.value=0;const a=t.createDynamicsCompressor();a.threshold.value=-18,a.knee.value=24,a.ratio.value=3.2,a.attack.value=.02,a.release.value=.35,s.connect(a),a.connect(t.destination),this.master=s;const n=t.createConvolver();n.buffer=O0(t);const r=t.createGain();r.gain.value=.42;const i=t.createGain();i.gain.value=.9,r.connect(n),n.connect(i),i.connect(s),this.revSend=r,this.shepard=[];const c=t.createGain();c.gain.value=.5,c.connect(s),c.connect(r);for(let b=0;b<qt;b++){const y=t.createOscillator();y.type="sine";const x=t.createGain();x.gain.value=0;const A=t.createOscillator();A.type="sine",A.frequency.value=.05+b*.017;const B=t.createGain();B.gain.value=1.6,A.connect(B),B.connect(y.detune),y.connect(x),x.connect(c),y.start(o),A.start(o),this.shepard.push({osc:y,g:x})}this.shepBus=c,this.noiseBuf=U0(t),this.layers={};for(const[b,y]of Object.entries(I0))this.layers[b]=this._makeLayer(b,y,s,r);const l=t.createBufferSource();l.buffer=this.noiseBuf,l.loop=!0;const u=t.createBiquadFilter();u.type="bandpass",u.frequency.value=700,u.Q.value=.8;const h=t.createGain();h.gain.value=0,l.connect(u),u.connect(h),h.connect(s),h.connect(r),l.start(o),this.wind={gain:h,filter:u};const p=t.createOscillator();p.type="sine",p.frequency.value=32;const d=t.createGain();d.gain.value=0,p.connect(d),d.connect(s),p.start(o),this.sub={osc:p,gain:d};const f=t.createOscillator();f.type="sine",f.frequency.value=54;const m=t.createGain();m.gain.value=0,f.connect(m),m.connect(s),f.start(o),this.heart={osc:f,gain:m},this._lastBeat=-10}_makeLayer(t,o,s,a){const n=this.ctx,r=n.currentTime,i=n.createGain();i.gain.value=0,i.connect(s),i.connect(a);const c=[];if(o.type==="air"||o.type==="glass"){const l=n.createBufferSource();l.buffer=this.noiseBuf,l.loop=!0;const u=n.createBiquadFilter();u.type=o.type==="glass"?"bandpass":"lowpass",u.frequency.value=o.base,u.Q.value=o.q,l.connect(u),u.connect(i),l.start(r+(o.type==="glass"?1.7:0)),c.push({src:l,f:u});const h=n.createOscillator();h.frequency.value=.037;const p=n.createGain();p.gain.value=o.base*.35,h.connect(p),p.connect(u.frequency),h.start(r)}if(o.type==="pad"||o.type==="choir"||o.type==="warm"||o.type==="deep"){const l=o.type==="deep"?[1,1.5,2,3]:o.type==="choir"?[1,1.5,2,2.5,3,4]:o.type==="warm"?[1,2,3,4.02]:[1,1.5,2.005,3];l.forEach((u,h)=>{const p=n.createOscillator();p.type=o.type==="warm"?"triangle":"sine",p.frequency.value=o.base*u,p.detune.value=(h-l.length/2)*3.5;const d=n.createGain();d.gain.value=1/(1+h*1.4);const f=n.createOscillator();f.frequency.value=.05+h*.031;const m=n.createGain();m.gain.value=d.gain.value*.35,f.connect(m),m.connect(d.gain),p.connect(d),d.connect(i),p.start(r),f.start(r),c.push({o:p,g:d})})}return{out:i,parts:c,cfg:o}}start(t=.9){const o=this.ctx;o.state==="suspended"&&o.resume(),this.master.gain.cancelScheduledValues(o.currentTime),this.master.gain.setTargetAtTime(t,o.currentTime,.6)}stop(){this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.4)}update(t,o,s,a=null,n=1/60){this.ctx;const r=Math.max(.02,n*2.2),i=-o*L0,c=22.5;for(let y=0;y<qt;y++){let x=((y+i)%qt+qt)%qt;const A=c*Math.pow(2,x),B=(x-(qt-1)/2)/(qt*.3),k=Math.exp(-B*B)*.14,w=this.shepard[y];w.osc.frequency.setTargetAtTime(A,t,r),w.g.gain.setTargetAtTime(k,t,r)}const l=T(Math.abs(s)/1.2,0,1);this._act===void 0&&(this._act=l),this._act=v(this._act,l,Math.min(1,n*2.5));const u=v(.16,1,this._act),h=T(Math.abs(s)/3,0,1);this.shepBus.gain.setTargetAtTime(v(.36,.15,h)*v(.3,1,this._act),t,r);const p=Go(o),d=Object.fromEntries(p.map(y=>[y.shell.id,y.w]));for(const[y,x]of Object.entries(this.layers)){const A=d[y]||0;x.out.gain.setTargetAtTime(A*x.cfg.gain*u,t,Math.max(r,.18))}const f=Math.abs(s);this.wind.gain.gain.setTargetAtTime(T(f*.1,0,.34),t,r),this.wind.filter.frequency.setTargetAtTime(300+T(f,0,12)*520,t,r),this.wind.filter.Q.setTargetAtTime(.6+T(f*.2,0,3),t,r);const m=T((o-18)/9,0,1);this.sub.gain.gain.setTargetAtTime(m*.16*v(.35,1,this._act),t,.5),this.sub.osc.frequency.setTargetAtTime(v(38,24,m),t,.8);const b=T(1-(o-.2)/1.6,0,1);if(b>.02){const x=Math.floor(t/.92);if(x!==this._lastBeat){this._lastBeat=x;const A=x*.92;A>=t-.05&&(this.heart.gain.gain.cancelScheduledValues(A),this.heart.gain.gain.setValueAtTime(1e-4,A),this.heart.gain.gain.exponentialRampToValueAtTime(.22*b,A+.045),this.heart.gain.gain.exponentialRampToValueAtTime(1e-4,A+.34),this.heart.gain.gain.setValueAtTime(1e-4,A+.3),this.heart.gain.gain.exponentialRampToValueAtTime(.13*b,A+.34),this.heart.gain.gain.exponentialRampToValueAtTime(1e-4,A+.62))}}a&&this.chime(t,o)}chime(t,o){const s=this.ctx,a=880*Math.pow(2,-T(o,0,27)*.09),n=s.createOscillator();n.type="sine",n.frequency.value=a;const r=s.createOscillator();r.type="sine",r.frequency.value=a*2.41;const i=s.createGain();i.gain.setValueAtTime(a*2.2,t),i.gain.exponentialRampToValueAtTime(a*.04,t+.8),r.connect(i),i.connect(n.frequency);const c=s.createGain();c.gain.setValueAtTime(1e-4,t),c.gain.exponentialRampToValueAtTime(.16,t+.012),c.gain.exponentialRampToValueAtTime(1e-4,t+3.4),n.connect(c),c.connect(this.master),c.connect(this.revSend),n.start(t),r.start(t),n.stop(t+3.6),r.stop(t+3.6)}}const N0=4.3,D0={human:.75,city:.85,earth:1,moon:.9,au:1,outer:1.1,heliopause:.7,oort:1.2,proxima:1,bubble:1,galaxy:1,localgroup:1,laniakea:1.1},Bo=.15,go=(e,t,o)=>({id:e,L0:t,L1:o,get text(){return X(`compare.${e}`)}}),q0=[go("m1",5.7,6.6),go("m2",7.9,8.75),go("m4",16.9,17.4)];function V0(e){for(const t of q0){if(e<=t.L0||e>=t.L1)continue;const o=at(t.L0,t.L0+Bo,e)*(1-at(t.L1-Bo,t.L1,e));if(o>.001)return{id:t.id,text:t.text,alpha:o}}return null}const et={hold0:.7,rush:2.5,peak:1.3,fall:1.2,settle:.6},Ds=2,qs=Ve(),ps={en:{peak:.5,settle:1.2},es:{peak:1.2,settle:2.3},zh:{peak:.4,settle:2.2}}[qs]||{};for(const e in ps)et[e]+=ps[e];const H0={en:{human:4.8,city:4.6,earth:1.7,moon:1.1,sun:.5,au:.7,outer:2.7,heliopause:2.8,oort:6.5,proxima:4.5,bubble:4.1,galaxy:3.5,localgroup:4.8,laniakea:4.7,universe:1},es:{human:5.8,city:3.6,earth:2.7,moon:1.7,sun:.5,au:3.4,outer:4.9,heliopause:3.8,oort:5.7,proxima:5.7,bubble:4.2,galaxy:5.5,localgroup:4.5,laniakea:3.7,universe:2.1},zh:{human:2.5,city:1.7,earth:1.5,moon:1.2,sun:.8,au:1.9,oort:5.1,proxima:1.3,bubble:2.3,galaxy:2.5,localgroup:3.1,laniakea:2.9}}[qs]||{},Vs=Ds+et.hold0+et.rush+et.peak+et.fall+et.settle,Rt={pull:1,rewind:4,land:4.5},W0=Rt.pull+Rt.rewind+Rt.land,yt=Math.log10(Ot[0].r),_e=Math.log10(Ot[Ot.length-1].r);function Y0(){const e=[];let t=Vs;for(let o=0;o<Ot.length;o++){const s=Ot[o],a=Math.log10(s.r),n=s.hold+(H0[s.id]||0);e.push({kind:"hold",stop:s,index:o,t0:t,t1:t+n,L0:a,L1:a}),t+=n;const r=Ot[o+1];if(r){const i=Math.log10(r.r),l=(i-a)*N0*(D0[s.id]??1);e.push({kind:"fly",from:s,to:r,index:o,t0:t,t1:t+l,L0:a,L1:i}),t+=l}}return{seg:e,tourEnd:t,total:t+W0}}const Wt=Y0(),ie=Wt.total;function yo(e){const t=Math.min(1,Math.max(0,e));return t*t*t*(t*(t*6-15)+10)}function $0(e){const t={L:yt,phase:"tour",stop:null,holdProgress:0,title:null,sub:null,fact:null,titleAlpha:0,factAlpha:0,cardAlpha:0,compare:null,compareAlpha:0,hero:null,heroAlpha:0,speed:0,warp:0};if(e<Vs){t.phase="prologue";let i=e-Ds;if(i<0)return t.L=yt,t;if(i<et.hold0)return t.L=yt,t.hero=X("hero.here"),t.heroAlpha=at(0,.25,i),t;if(i-=et.hold0,i<et.rush){const c=i/et.rush,l=c*c*(3-2*c);return t.L=yt+(wt-yt)*l,t.hero=X("hero.here"),t.heroAlpha=Math.max(0,1-c*3),t.speed=(wt-yt)/et.rush*(6*c*(1-c)),t.warp=Math.min(1,t.speed/6),t}if(i-=et.rush,i<et.peak)return t.L=wt,t.hero=X("hero.there"),t.heroAlpha=at(0,.3,i)*(1-at(et.peak-.35,et.peak,i)),t.warp=1-at(0,.4,i),t;if(i-=et.peak,i<et.fall){const c=i/et.fall,l=yo(c);return t.L=wt+(yt-wt)*l,t.speed=-((wt-yt)/et.fall),t.warp=Math.min(1,Math.abs(t.speed)/8),t}return i-=et.fall,t.L=yt,t.hero=X("hero.real"),t.heroAlpha=at(0,.2,i)*(1-at(et.settle-.3,et.settle,i)),t}if(e>=Wt.tourEnd){t.phase="outro";let i=e-Wt.tourEnd;if(i<Rt.pull)return t.L=_e,t.stop=Ot[Ot.length-1],t.title=t.stop.title,t.cardAlpha=1-at(0,Rt.pull,i),t.titleAlpha=t.cardAlpha,t;if(i-=Rt.pull,i<Rt.rewind){const c=i/Rt.rewind;return t.L=_e+(yt-_e)*yo(c),t.speed=-((_e-yt)/Rt.rewind),t.warp=Math.min(1,Math.abs(t.speed)/8),t.hero=null,t}return i-=Rt.rewind,t.L=yt,t.hero=X("hero.here"),t.heroAlpha=at(0,.5,i),t.phase="outro-end",t}const o=Wt.seg.find(i=>e>=i.t0&&e<i.t1)||Wt.seg[Wt.seg.length-1];if(o.kind==="hold"){const i=(e-o.t0)/Math.max(1e-6,o.t1-o.t0);return t.L=o.L0,t.stop=o.stop,t.holdProgress=i,t.title=o.stop.title,t.sub=o.stop.size,t.fact=o.stop.fact,t.cardAlpha=at(0,.18,i)*(1-at(.82,1,i)),t.titleAlpha=t.cardAlpha,t.factAlpha=at(.12,.32,i)*(1-at(.8,1,i)),t}const s=(e-o.t0)/Math.max(1e-6,o.t1-o.t0),a=yo(s);t.L=o.L0+(o.L1-o.L0)*a,t.stop=null;const n=30*s*s*(s-1)*(s-1);t.speed=(o.L1-o.L0)/(o.t1-o.t0)*n,o.t1-o.t0>2&&(t.title=o.to.title,t.titleAlpha=.55*at(.1,.3,s)*(1-at(.75,.95,s)));const r=V0(t.L);if(r){t.compare=r.text;const i=at(o.L0,o.L0+Bo,t.L);t.compareAlpha=r.alpha*i}return t}const j0={"-":"⁻",".":"·",0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹"},K0=e=>String(e).split("").map(t=>j0[t]??t).join(""),X0=[{L:.23,key:"mark.human"},{L:4.08,key:"mark.city"},{L:7.11,key:"mark.earth"},{L:8.89,key:"mark.moon"},{L:11.18,key:"mark.au"},{L:12.98,key:"mark.neptune"},{L:16.6,key:"mark.ly"},{L:18.23,key:"mark.ly90"},{L:21,key:"mark.galaxy"},{L:23,key:"mark.group"},{L:24.7,key:"mark.laniakea"},{L:26.94,key:"mark.all"}];class Q0{constructor(){this.el={scale:document.getElementById("hud-scale"),scaleValue:document.getElementById("scale-value"),lightValue:document.getElementById("light-value"),scaleExp:document.getElementById("scale-exp"),card:document.getElementById("hud-card"),title:document.getElementById("card-title"),size:document.getElementById("card-size"),fact:document.getElementById("card-fact"),hero:document.querySelector("#hero span"),ladder:document.getElementById("ladder"),ladderMarks:document.querySelector(".ladder-marks"),ladderCursor:document.querySelector(".ladder-cursor"),progress:document.getElementById("progress"),pgFill:document.querySelector(".pg-fill"),pgStops:document.querySelector(".pg-stops"),controls:document.getElementById("controls"),hint:document.getElementById("hint")},this._buildLadder(),this._buildProgress(),this.el.compare=this._buildCompare(),this._lastText={},gs(()=>this.relabel())}relabel(){for(const t of this.marks)t.textContent=X(t.dataset.key);this._lastText={}}_buildCompare(){const t=document.createElement("div");return t.id="hud-compare",t.style.cssText=["position:fixed","left:50%","bottom:calc(clamp(70px, 11vh, 128px) + clamp(158px, 22.5vh, 240px))","transform:translateX(-50%)","width:min(680px, 86vw)","text-align:center","pointer-events:none","z-index:18","font-weight:300","font-size:clamp(14px, 1.9vw, 22px)","line-height:1.34","letter-spacing:0.08em","color:rgba(200, 226, 255, 0.96)","text-shadow:0 1px 2px rgba(0, 0, 0, 0.9), 0 2px 16px rgba(0, 0, 0, 0.95), 0 0 40px rgba(90, 150, 225, 0.3)","opacity:0"].join(";"),document.body.appendChild(t),t}_buildLadder(){const t=document.createDocumentFragment();for(const o of X0){const s=document.createElement("div");s.className="m",s.textContent=X(o.key),s.style.top=`${(1-(o.L-Yt)/(wt-Yt))*100}%`,s.dataset.l=o.L,s.dataset.key=o.key,t.appendChild(s)}this.el.ladderMarks.appendChild(t),this.marks=[...this.el.ladderMarks.children]}_buildProgress(){const t=document.createDocumentFragment();for(const o of Wt.seg){if(o.kind!=="hold")continue;const s=document.createElement("i");s.style.left=`${o.t0/ie*100}%`,s.dataset.t=o.t0,t.appendChild(s)}this.el.pgStops.appendChild(t),this.stopMarks=[...this.el.pgStops.children]}show(t=!0){for(const o of["scale","ladder","progress","controls"])this.el[o].classList.toggle("on",t)}hint(t){this.el.hint.classList.toggle("on",t)}update(t,o,s){const a=Math.pow(10,o),n=Ra(a);n!==this._lastText.sv&&(this.el.scaleValue.textContent=n,this._lastText.sv=n);const r=Ea(a);r!==this._lastText.lv&&(this.el.lightValue.textContent=r,this._lastText.lv=r);const i=`10${K0(o.toFixed(2))} ${X("unit.m")}`;i!==this._lastText.ev&&(this.el.scaleExp.textContent=i,this._lastText.ev=i);const c=t.title||"";c!==this._lastText.title&&(this.el.title.textContent=c,this._lastText.title=c);const l=t.sub||"";l!==this._lastText.size&&(this.el.size.textContent=l,this._lastText.size=l);const u=t.fact||"";u!==this._lastText.fact&&(this.el.fact.textContent=u,this._lastText.fact=u),this.el.title.style.opacity=t.titleAlpha,this.el.size.style.opacity=t.cardAlpha,this.el.fact.style.opacity=t.factAlpha;const h=t.compare||"";h!==this._lastText.cmp&&(this.el.compare.textContent=h,this._lastText.cmp=h),this.el.compare.style.opacity=t.compareAlpha||0;const p=t.hero||"";p!==this._lastText.hero&&(this.el.hero.textContent=p,this._lastText.hero=p),this.el.hero.style.opacity=t.heroAlpha||0;const d=(o-Yt)/(wt-Yt);this.el.ladderCursor.style.top=`${(1-d)*100}%`;for(const f of this.marks)f.classList.toggle("hot",Math.abs(+f.dataset.l-o)<.55);if(s!==null){this.el.pgFill.style.width=`${Math.min(100,s/ie*100)}%`;for(const f of this.stopMarks)f.classList.toggle("done",+f.dataset.t<=s)}}freeMode(t){this.el.card.style.display=t?"none":"",this.el.compare.style.display=t?"none":"",this.el.progress.style.display=t?"none":"",this.hint(t)}}function Hs(e=document){document.documentElement.lang=Ve();for(const t of e.querySelectorAll("[data-i18n]"))t.textContent=X(t.dataset.i18n);for(const t of e.querySelectorAll("[data-i18n-html]"))t.innerHTML=X(t.dataset.i18nHtml);for(const t of e.querySelectorAll("[data-i18n-attr]"))for(const o of t.dataset.i18nAttr.split(";")){const s=o.indexOf(":");if(s<0)continue;const a=o.slice(0,s).trim(),n=o.slice(s+1).trim();a&&n&&t.setAttribute(a,X(n))}}Hs();const we=document.getElementById("gl"),Ws=js(we),Ut=new ca(Ws,we),rt=new F0(Ws,Ut),Xt=new Q0,re=new URLSearchParams(location.search),Zt=re.has("capture"),Qt=re.has("record"),qe=parseFloat(re.get("t")||"0"),xo=re.has("L")?parseFloat(re.get("L")):null,O={mode:re.has("free")?"free":"tour",playing:!1,tourTime:qe,soundOn:!0,lastFrame:0,L:.23,speed:0,warp:0,fade:1,lastStopId:null};let Lt=null,jt=null;function Ys(){const e=window.innerWidth,t=window.innerHeight,o=Zt?1:Math.min(window.devicePixelRatio||1,2);Ut.resize(e,t,o),rt.camera.aspect=Ut.w/Ut.h}window.addEventListener("resize",Ys);Ys();const Le=document.getElementById("loader"),Z0=document.querySelector(".loader-bar i"),J0=document.getElementById("loader-note");(Zt||Qt)&&(Le.style.display="none");await rt.init((e,t)=>{Z0.style.width=`${e*100}%`,J0.textContent=X(`shell.${t}`)});const ti=/^(.+?)\s+·\s+([\d\s.,]+)\s+(звёзд|галактик)$/,ei=/^процедурная замена\s+(.+)$/;function oi(e){const t=ti.exec(e);if(t){const s=Number(t[2].replace(/[^\d]/g,"")),a=X(t[3]==="звёзд"?"src.stars":"src.galaxies");return`${t[1]} · ${Pt(s)} ${a}`}const o=ei.exec(e);return o?X("src.procedural",{name:o[1]}):e}const si=document.getElementById("about-src");function $s(){si.textContent=rt.sources.length?X("about.sources",{list:rt.sources.map(oi).join(" · ")}):""}$s();Zt||Qt?Le.style.display="none":(Le.classList.add("done"),setTimeout(()=>Le.style.display="none",900));jt=new Fa(rt.camera,we,{min:Yt,max:wt});const Vt=document.getElementById("start"),ai=document.getElementById("btn-start"),ni=document.getElementById("btn-free"),Me=document.getElementById("btn-play"),fs=document.getElementById("btn-sound"),Co=document.getElementById("btn-mode"),Xo=document.getElementById("btn-lang"),ii=document.getElementById("btn-info"),Qo=document.getElementById("about");function Zo(){if(Lt)return Lt;const e=window.AudioContext||window.webkitAudioContext;return e?(Lt=new G0(new e),Lt.start(O.soundOn?.9:0),Lt):null}function Jo(){O.mode="tour",O.playing=!0,O.tourTime=qe,Xt.show(!0),Xt.freeMode(!1),Zo()}function $e(){O.mode="free",O.playing=!1,jt.enabled=!0,jt.syncFrom(rt.camera.L),Xt.show(!0),Xt.freeMode(!0),Zo()}Zt||Qt?(document.body.classList.add("capture"),Vt.hidden=!0,Vt.style.display="none",Xt.show(!0),Xt.freeMode(!1),O.playing=!1,O.soundOn=!1):(Vt.hidden=!1,ai.addEventListener("click",()=>{Vt.classList.add("fade"),setTimeout(()=>Vt.hidden=!0,700),Jo()}),ni.addEventListener("click",()=>{Vt.classList.add("fade"),setTimeout(()=>Vt.hidden=!0,700),$e()}));Me.addEventListener("click",()=>{if(O.mode==="free"){Jo();return}O.playing=!O.playing,Me.textContent=O.playing?"❚❚":"▶"});fs.addEventListener("click",()=>{O.soundOn=!O.soundOn,fs.classList.toggle("off",!O.soundOn);const e=Zo();e&&(O.soundOn?e.start(.9):e.stop())});Co.addEventListener("click",()=>{O.mode==="tour"?$e():Jo(),Co.classList.toggle("off",O.mode==="tour")});Xo.textContent=ds[Ve()];Xo.addEventListener("click",()=>Ma(wa()));gs(()=>{Xo.textContent=ds[Ve()],Hs(),$s(),Me.textContent=O.playing?"❚❚":"▶"});ii.addEventListener("click",()=>{Qo.hidden=!1});document.getElementById("about-close").addEventListener("click",()=>{Qo.hidden=!0});window.addEventListener("keydown",e=>{e.key==="Escape"&&(Qo.hidden=!0),e.key===" "&&!Zt&&(e.preventDefault(),Me.click())});we.addEventListener("wheel",()=>{O.mode==="tour"&&!Zt&&!Qt&&($e(),Co.classList.remove("off"))},{passive:!0});function Fo(e,t,o){let s;if(O.mode==="free"?(jt.update(o),O.L=rt.camera.L,O.speed=jt.velocity,s={L:O.L,phase:"free",stop:null,title:null,sub:null,fact:null,titleAlpha:0,factAlpha:0,cardAlpha:0,hero:null,heroAlpha:0,speed:O.speed,warp:T(Math.abs(O.speed)/7,0,1)}):(s=$0(e),O.L=s.L,O.speed=s.speed),xo!==null&&Number.isFinite(xo)&&(s.L=T(xo,Yt,wt),O.L=s.L),O.warp=s.warp||0,rt.camera.L=s.L,O.mode==="free"?(rt.camera.drift(t*.35,s.L),rt.camera.yaw+=jt.userYaw,rt.camera.pitch=T(rt.camera.pitch+jt.userPitch,-1.35,1.35)):rt.camera.drift(e,s.L),Ut.beginScene(),rt.draw(s.L,t),Ut.present({time:t,warp:O.warp,fade:O.fade,L:s.L}),Xt.update(s,s.L,O.mode==="tour"?e:null),Lt&&O.soundOn){const a=s.stop?s.stop.id:null,n=a&&a!==O.lastStopId?a:null;O.lastStopId=a,Lt.update(Lt.ctx.currentTime,s.L,s.speed||0,n,o)}return s}function Lo(e){requestAnimationFrame(Lo);const t=e/1e3,o=O.lastFrame?Math.min(.1,t-O.lastFrame):1/60;O.lastFrame=t,O.mode==="tour"&&O.playing&&(Qt&&window.__rec&&window.__rec._t0!==void 0?O.tourTime=t-window.__rec._t0:O.tourTime+=o,O.tourTime>=ie&&(O.tourTime=ie-.001,O.playing=!1,Qt||(Me.textContent="▶",$e()))),Fo(O.tourTime,t,o)}if(Qt){requestAnimationFrame(Lo);let e=null,t=0,o=0;window.__rec={duration:ie,ready:!0,t:()=>O.tourTime,playing:()=>O.playing,pending:()=>o,warmup(){return new Promise(s=>{let a=Yt;const n=()=>{if(a>wt){s();return}rt.camera.L=a,rt.camera.drift(a*2.3,a),Ut.beginScene(),rt.draw(a,a*4.1),Ut.present({time:a*4.1,warp:a%1<.5?.6:0,fade:1,L:a}),a+=.14,requestAnimationFrame(n)};n()})},async start(s){const a=`http://localhost:${s}/chunk`;let n;try{n=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:60},cursor:"never"},audio:!1,preferCurrentTab:!0})}catch(r){console.warn("захват вкладки не дали, пишу голый канвас:",r.message),n=we.captureStream(60)}e=new MediaRecorder(n,{mimeType:"video/webm;codecs=vp9",videoBitsPerSecond:3e7}),e.ondataavailable=r=>{if(!r.data.size)return;const i=t++;o++,fetch(`${a}?seq=${i}`,{method:"POST",body:r.data}).catch(()=>{}).finally(()=>{o--})},this.done=new Promise(r=>{e.onstop=()=>r()}),e.start(1e3),this.preroll=3,await new Promise(r=>setTimeout(r,this.preroll*1e3)),O.mode="tour",O.tourTime=0,O.lastFrame=0,O.playing=!0,this._t0=performance.now()/1e3},stop(){e&&e.state!=="inactive"&&e.stop();const s=document.createElement("div");s.style.cssText="position:fixed;inset:0;background:#000;z-index:99;display:grid;place-items:center;color:#8fc7ff;font:500 28px system-ui;letter-spacing:.08em",s.textContent="ДОСЫЛАЮ ЗАПИСЬ — НЕ ЗАКРЫВАЙ ОКНО",document.body.appendChild(s)}}}else Zt?(window.__uz={duration:ie,async seek(e){Fo(e,e,1/60),await new Promise(t=>requestAnimationFrame(()=>t()))},ready:!0},Fo(qe,qe,1/60)):requestAnimationFrame(Lo);window.__scene=rt;window.__state=O;window.__activeShells=Go;
