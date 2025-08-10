import{E as f,U as at,T as le,k as G,c as Ce,F as y,s as S,M as P,a3 as Se,R as ee,w as Ue,z as Re,D as E,aa as ue,N,ab as F,l as I,ac as st,Z as Be,ad as ce,x as O,ae as it,af as te,J as Q,ag as k,b as de,B as A,q as re,t as ot,G as lt,Y as J,ah as ut,m as Me,p as Fe,a5 as Ge,a8 as De,ai as ke,n as ct,o as dt,a6 as ht,a7 as ft,a9 as pt,aj as mt,ak as gt,al as K,am as xt,an as _t,a0 as he,ao as fe,e as T,ap as bt}from"./index-CQg1ocsT.js";import{S as L,c as V,a as Tt,b as yt,B as Ae}from"./colorToUniform-DmtBy-2V.js";class ze{static init(e){Object.defineProperty(this,"resizeTo",{set(t){globalThis.removeEventListener("resize",this.queueResize),this._resizeTo=t,t&&(globalThis.addEventListener("resize",this.queueResize),this.resize())},get(){return this._resizeTo}}),this.queueResize=()=>{this._resizeTo&&(this._cancelResize(),this._resizeId=requestAnimationFrame(()=>this.resize()))},this._cancelResize=()=>{this._resizeId&&(cancelAnimationFrame(this._resizeId),this._resizeId=null)},this.resize=()=>{if(!this._resizeTo)return;this._cancelResize();let t,r;if(this._resizeTo===globalThis.window)t=globalThis.innerWidth,r=globalThis.innerHeight;else{const{clientWidth:n,clientHeight:a}=this._resizeTo;t=n,r=a}this.renderer.resize(t,r),this.render()},this._resizeId=null,this._resizeTo=null,this.resizeTo=e.resizeTo||null}static destroy(){globalThis.removeEventListener("resize",this.queueResize),this._cancelResize(),this._cancelResize=null,this.queueResize=null,this.resizeTo=null,this.resize=null}}ze.extension=f.Application;class Ie{static init(e){e=Object.assign({autoStart:!0,sharedTicker:!1},e),Object.defineProperty(this,"ticker",{set(t){this._ticker&&this._ticker.remove(this.render,this),this._ticker=t,t&&t.add(this.render,this,at.LOW)},get(){return this._ticker}}),this.stop=()=>{this._ticker.stop()},this.start=()=>{this._ticker.start()},this._ticker=null,this.ticker=e.sharedTicker?le.shared:new le,e.autoStart&&this.start()}static destroy(){if(this._ticker){const e=this._ticker;this.ticker=null,e.destroy()}}}Ie.extension=f.Application;class Oe{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}Oe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"filter"};function vt(o,e){e.clear();const t=e.matrix;for(let r=0;r<o.length;r++){const n=o[r];n.globalDisplayStatus<7||(e.matrix=n.worldTransform,e.addBounds(n.bounds))}return e.matrix=t,e}const wt=new Se({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class Pt{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new Re,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0}}}class Le{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new G({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new Ce({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,n=this._pushFilterData();n.skip=!1,n.filters=r,n.container=e.container,n.outputRenderSurface=t.renderTarget.renderSurface;const a=t.renderTarget.renderTarget.colorTexture.source,s=a.resolution,i=a.antialias;if(r.length===0){n.skip=!0;return}const u=n.bounds;if(this._calculateFilterArea(e,u),this._calculateFilterBounds(n,t.renderTarget.rootViewPort,i,s,1),n.skip)return;const l=this._getPreviousFilterData(),d=this._findFilterResolution(s);let c=0,h=0;l&&(c=l.bounds.minX,h=l.bounds.minY),this._calculateGlobalFrame(n,c,h,d,a.width,a.height),this._setupFilterTextures(n,u,t,l)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const n=e.source,a=n.resolution,s=n.antialias;if(t.length===0)return r.skip=!0,e;const i=r.bounds;if(i.addRect(e.frame),this._calculateFilterBounds(r,i.rectangle,s,a,0),r.skip)return e;const u=a;this._calculateGlobalFrame(r,0,0,u,n.width,n.height),r.outputRenderSurface=y.getOptimalTexture(i.width,i.height,r.resolution,r.antialias),r.backTexture=S.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const h=r.outputRenderSurface;return h.source.alphaMode="premultiplied-alpha",h}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&y.returnTexture(t.backTexture),y.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const n=e.colorTexture.source._resolution,a=y.getOptimalTexture(t.width,t.height,n,!1);let s=t.minX,i=t.minY;r&&(s-=r.minX,i-=r.minY),s=Math.floor(s*n),i=Math.floor(i*n);const u=Math.ceil(t.width*n),l=Math.ceil(t.height*n);return this.renderer.renderTarget.copyToTexture(e,a,{x:s,y:i},{width:u,height:l},{x:0,y:0}),a}applyFilter(e,t,r,n){const a=this.renderer,s=this._activeFilterData,u=s.outputRenderSurface===r,l=a.renderTarget.rootRenderTarget.colorTexture.source._resolution,d=this._findFilterResolution(l);let c=0,h=0;if(u){const p=this._findPreviousFilterOffset();c=p.x,h=p.y}this._updateFilterUniforms(t,r,s,c,h,d,u,n),this._setupBindGroupsAndRender(e,t,a)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,n=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),a=t.worldTransform.copyTo(P.shared),s=t.renderGroup||t.parentRenderGroup;return s&&s.cacheToLocalTransform&&a.prepend(s.cacheToLocalTransform),a.invert(),n.prepend(a),n.scale(1/t.texture.orig.width,1/t.texture.orig.height),n.translate(t.anchor.x,t.anchor.y),n}destroy(){}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const n=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(n,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:wt,shader:e,state:e._state,topology:"triangle-list"}),r.type===ee.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,n){if(e.backTexture=S.EMPTY,e.blendRequired){r.renderTarget.finishRenderPass();const a=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(a,t,n==null?void 0:n.bounds)}e.inputTexture=y.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),r.renderTarget.bind(e.inputTexture,!0),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,n,a,s){const i=e.globalFrame;i.x=t*n,i.y=r*n,i.width=a*n,i.height=s*n}_updateFilterUniforms(e,t,r,n,a,s,i,u){const l=this._filterGlobalUniforms.uniforms,d=l.uOutputFrame,c=l.uInputSize,h=l.uInputPixel,p=l.uInputClamp,x=l.uGlobalFrame,_=l.uOutputTexture;i?(d[0]=r.bounds.minX-n,d[1]=r.bounds.minY-a):(d[0]=0,d[1]=0),d[2]=e.frame.width,d[3]=e.frame.height,c[0]=e.source.width,c[1]=e.source.height,c[2]=1/c[0],c[3]=1/c[1],h[0]=e.source.pixelWidth,h[1]=e.source.pixelHeight,h[2]=1/h[0],h[3]=1/h[1],p[0]=.5*h[2],p[1]=.5*h[3],p[2]=e.frame.width*c[2]-.5*h[2],p[3]=e.frame.height*c[3]-.5*h[3];const g=this.renderer.renderTarget.rootRenderTarget.colorTexture;x[0]=n*s,x[1]=a*s,x[2]=g.source.width*s,x[3]=g.source.height*s,t instanceof S&&(t.source.resource=null);const m=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind(t,!!u),t instanceof S?(_[0]=t.frame.width,_[1]=t.frame.height):(_[0]=m.width,_[1]=m.height),_[2]=m.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const n=this._filterStack[r];if(!n.skip){e=n.bounds.minX,t=n.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?vt(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const n=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;n&&t.applyMatrix(n)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,n=e.bounds,a=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),a.length===1)a[0].apply(this,r,e.outputRenderSurface,t);else{let s=e.inputTexture;const i=y.getOptimalTexture(n.width,n.height,s.source._resolution,!1);let u=i,l=0;for(l=0;l<a.length-1;++l){a[l].apply(this,s,u,!0);const c=s;s=u,u=c}a[l].apply(this,s,e.outputRenderSurface,t),y.returnTexture(i)}}_calculateFilterBounds(e,t,r,n,a){var _;const s=this.renderer,i=e.bounds,u=e.filters;let l=1/0,d=0,c=!0,h=!1,p=!1,x=!0;for(let g=0;g<u.length;g++){const m=u[g];if(l=Math.min(l,m.resolution==="inherit"?n:m.resolution),d+=m.padding,m.antialias==="off"?c=!1:m.antialias==="inherit"&&c&&(c=r),m.clipToViewport||(x=!1),!!!(m.compatibleRenderers&s.type)){p=!1;break}if(m.blendRequired&&!(((_=s.backBuffer)==null?void 0:_.useBackBuffer)??!0)){Ue("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=m.enabled||p,h||(h=m.blendRequired)}if(!p){e.skip=!0;return}if(x&&i.fitBounds(0,t.width/n,0,t.height/n),i.scale(l).ceil().scale(1/l).pad((d|0)*a),!i.isPositive){e.skip=!0;return}e.antialias=c,e.resolution=l,e.blendRequired=h}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new Pt),this._filterStackIndex++,e}}Le.extension={type:[f.WebGLSystem,f.WebGPUSystem],name:"filter"};let R=null,w=null;function Ct(o,e){R||(R=E.get().createCanvas(256,128),w=R.getContext("2d",{willReadFrequently:!0}),w.globalCompositeOperation="copy",w.globalAlpha=1),(R.width<o||R.height<e)&&(R.width=ue(o),R.height=ue(e))}function pe(o,e,t){for(let r=0,n=4*t*e;r<e;++r,n+=4)if(o[n+3]!==0)return!1;return!0}function me(o,e,t,r,n){const a=4*e;for(let s=r,i=r*a+4*t;s<=n;++s,i+=a)if(o[i+3]!==0)return!1;return!0}function St(...o){let e=o[0];e.canvas||(e={canvas:o[0],resolution:o[1]});const{canvas:t}=e,r=Math.min(e.resolution??1,1),n=e.width??t.width,a=e.height??t.height;let s=e.output;if(Ct(n,a),!w)throw new TypeError("Failed to get canvas 2D context");w.drawImage(t,0,0,n,a,0,0,n*r,a*r);const u=w.getImageData(0,0,n,a).data;let l=0,d=0,c=n-1,h=a-1;for(;d<a&&pe(u,n,d);)++d;if(d===a)return N.EMPTY;for(;pe(u,n,h);)--h;for(;me(u,n,l,d,h);)++l;for(;me(u,n,c,d,h);)--c;return++c,++h,w.globalCompositeOperation="source-over",w.strokeRect(l,d,c-l,h-d),w.globalCompositeOperation="copy",s??(s=new N),s.set(l/r,d/r,(c-l)/r,(h-d)/r),s}const ge=new N;class Ut{getCanvasAndContext(e){const{text:t,style:r,resolution:n=1}=e,a=r._getFinalPadding(),s=F.measureText(t||" ",r),i=Math.ceil(Math.ceil(Math.max(1,s.width)+a*2)*n),u=Math.ceil(Math.ceil(Math.max(1,s.height)+a*2)*n),l=I.getOptimalCanvasAndContext(i,u);this._renderTextToCanvas(t,r,a,n,l);const d=r.trim?St({canvas:l.canvas,width:i,height:u,resolution:1,output:ge}):ge.set(0,0,i,u);return{canvasAndContext:l,frame:d}}returnCanvasAndContext(e){I.returnCanvasAndContext(e)}_renderTextToCanvas(e,t,r,n,a){var U,D,v,M;const{canvas:s,context:i}=a,u=st(t),l=F.measureText(e||" ",t),d=l.lines,c=l.lineHeight,h=l.lineWidths,p=l.maxLineWidth,x=l.fontProperties,_=s.height;if(i.resetTransform(),i.scale(n,n),i.textBaseline=t.textBaseline,(U=t._stroke)!=null&&U.width){const C=t._stroke;i.lineWidth=C.width,i.miterLimit=C.miterLimit,i.lineJoin=C.join,i.lineCap=C.cap}i.font=u;let g,m;const B=t.dropShadow?2:1;for(let C=0;C<B;++C){const ae=t.dropShadow&&C===0,W=ae?Math.ceil(Math.max(1,_)+r*2):0,et=W*n;if(ae){i.fillStyle="black",i.strokeStyle="black";const b=t.dropShadow,tt=b.color,rt=b.alpha;i.shadowColor=Be.shared.setValue(tt).setAlpha(rt).toRgbaString();const nt=b.blur*n,oe=b.distance*n;i.shadowBlur=nt,i.shadowOffsetX=Math.cos(b.angle)*oe,i.shadowOffsetY=Math.sin(b.angle)*oe+et}else{if(i.fillStyle=t._fill?ce(t._fill,i,l,r*2):null,(D=t._stroke)!=null&&D.width){const b=t._stroke.width*.5+r*2;i.strokeStyle=ce(t._stroke,i,l,b)}i.shadowColor="black"}let se=(c-x.fontSize)/2;c-x.fontSize<0&&(se=0);const ie=((v=t._stroke)==null?void 0:v.width)??0;for(let b=0;b<d.length;b++)g=ie/2,m=ie/2+b*c+x.ascent+se,t.align==="right"?g+=p-h[b]:t.align==="center"&&(g+=(p-h[b])/2),(M=t._stroke)!=null&&M.width&&this._drawLetterSpacing(d[b],t,a,g+r,m+r-W,!0),t._fill!==void 0&&this._drawLetterSpacing(d[b],t,a,g+r,m+r-W)}}_drawLetterSpacing(e,t,r,n,a,s=!1){const{context:i}=r,u=t.letterSpacing;let l=!1;if(F.experimentalLetterSpacingSupported&&(F.experimentalLetterSpacing?(i.letterSpacing=`${u}px`,i.textLetterSpacing=`${u}px`,l=!0):(i.letterSpacing="0px",i.textLetterSpacing="0px")),u===0||l){s?i.strokeText(e,n,a):i.fillText(e,n,a);return}let d=n;const c=F.graphemeSegmenter(e);let h=i.measureText(e).width,p=0;for(let x=0;x<c.length;++x){const _=c[x];s?i.strokeText(_,d,a):i.fillText(_,d,a);let g="";for(let m=x+1;m<c.length;++m)g+=c[m];p=i.measureText(g).width,d+=h-p+u,h=p}}}const Y=new Ut,xe="http://www.w3.org/2000/svg",_e="http://www.w3.org/1999/xhtml";class Ee{constructor(){this.svgRoot=document.createElementNS(xe,"svg"),this.foreignObject=document.createElementNS(xe,"foreignObject"),this.domElement=document.createElementNS(_e,"div"),this.styleElement=document.createElementNS(_e,"style");const{foreignObject:e,svgRoot:t,styleElement:r,domElement:n}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(n),this.image=E.get().createImage()}}let be;function Rt(o,e,t,r){r||(r=be||(be=new Ee));const{domElement:n,styleElement:a,svgRoot:s}=r;n.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${o}</div>`,n.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(a.textContent=t),document.body.appendChild(s);const i=n.getBoundingClientRect();s.remove();const u=e.padding*2;return{width:i.width-u,height:i.height-u}}class Bt{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{O.return(e)}),this.batches.length=0}}class Ve{constructor(e,t){this.state=L.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,n=this.renderer.graphicsContext.updateGpuContext(t);return!!(n.isBatchable||r!==n.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let n=0;n<r.length;n++){const a=r[n];a._batcher.updateElement(a)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const a=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const s=a.resources.localUniforms.uniforms;s.uTransformMatrix=e.groupTransform,s.uRound=t._roundPixels|e._roundPixels,V(e.groupColorAlpha,s.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,n=this._getGpuDataForRenderable(e).batches;for(let a=0;a<n.length;a++){const s=n[a];r.addToBatch(s,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new Bt;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,n=this.renderer.graphicsContext.getGpuContext(r),a=this.renderer._roundPixels|e._roundPixels;t.batches=n.batches.map(s=>{const i=O.get(it);return s.copyTo(i),i.renderable=e,i.roundPixels=a,i})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Ve.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"graphics"};class ne{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let n=r;const a=this.texture.textureMatrix;return a.isSimple||(n=this._transformedUvs,(this._textureMatrixUpdateId!==a._updateID||this._uvUpdateId!==t._updateID)&&((!n||n.length<r.length)&&(n=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=a._updateID,this._uvUpdateId=t._updateID,a.multiplyUvs(r,n))),n}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class Te{destroy(){}}class We{constructor(e,t){this.localUniforms=new G({uTransformMatrix:{value:new P,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new Ce({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,n=e.batched;if(t.batched=n,r!==n)return!0;if(n){const a=e._geometry;if(a.indices.length!==t.indexSize||a.positions.length!==t.vertexSize)return t.indexSize=a.indices.length,t.vertexSize=a.positions.length,!0;const s=this._getBatchableMesh(e);return s.texture.uid!==e._texture.uid&&(s._textureMatrixUpdateId=-1),!s._batcher.checkAndUpdateTexture(s,e._texture)}return!1}addRenderable(e,t){var a,s;const r=this.renderer.renderPipes.batch,n=this._getMeshData(e);if(e.didViewUpdate&&(n.indexSize=(a=e._geometry.indices)==null?void 0:a.length,n.vertexSize=(s=e._geometry.positions)==null?void 0:s.length),n.batched){const i=this._getBatchableMesh(e);i.setTexture(e._texture),i.geometry=e._geometry,r.addToBatch(i,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=te(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),V(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new Te),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:0,vertexSize:0},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new Te),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new ne;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}We.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"mesh"};class Mt{execute(e,t){const r=e.state,n=e.renderer,a=t.shader||e.defaultShader;a.resources.uTexture=t.texture._source,a.resources.uniforms=e.localUniforms;const s=n.gl,i=e.getBuffers(t);n.shader.bind(a),n.state.set(r),n.geometry.bind(i.geometry,a.glProgram);const l=i.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?s.UNSIGNED_SHORT:s.UNSIGNED_INT;s.drawElements(s.TRIANGLES,t.particleChildren.length*6,l,0)}}class Ft{execute(e,t){const r=e.renderer,n=t.shader||e.defaultShader;n.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),n.groups[1]=r.texture.getTextureBindGroup(t.texture);const a=e.state,s=e.getBuffers(t);r.encoder.draw({geometry:s.geometry,shader:t.shader||e.defaultShader,state:a,size:t.particleChildren.length*6})}}function ye(o,e=null){const t=o*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,n=0;r<t;r+=6,n+=4)e[r+0]=n+0,e[r+1]=n+1,e[r+2]=n+2,e[r+3]=n+0,e[r+4]=n+2,e[r+5]=n+3;return e}function Gt(o){return{dynamicUpdate:ve(o,!0),staticUpdate:ve(o,!1)}}function ve(o,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const a in o){const s=o[a];if(e!==s.dynamic)continue;t.push(`offset = index + ${r}`),t.push(s.code);const i=Q(s.format);r+=i.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const n=t.join(`
`);return new Function("ps","f32v","u32v",n)}class Dt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let n=0,a=0;for(const d in r){const c=r[d],h=Q(c.format);c.dynamic?a+=h.stride:n+=h.stride}this._dynamicStride=a/4,this._staticStride=n/4,this.staticAttributeBuffer=new k(t*4*n),this.dynamicAttributeBuffer=new k(t*4*a),this.indexBuffer=ye(t);const s=new Se;let i=0,u=0;this._staticBuffer=new de({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:A.VERTEX|A.COPY_DST}),this._dynamicBuffer=new de({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:A.VERTEX|A.COPY_DST});for(const d in r){const c=r[d],h=Q(c.format);c.dynamic?(s.addAttribute(c.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:i*4,format:c.format}),i+=h.size):(s.addAttribute(c.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:c.format}),u+=h.size)}s.addIndex(this.indexBuffer);const l=this.getParticleUpdate(r);this._dynamicUpload=l.dynamicUpdate,this._staticUpload=l.staticUpdate,this.geometry=s}getParticleUpdate(e){const t=kt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return Gt(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new k(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new k(this._size*this._dynamicStride*4*4),this.indexBuffer=ye(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const n=this.staticAttributeBuffer;this._staticUpload(e,n.float32View,n.uint32View),this._staticBuffer.setDataWithSize(n.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function kt(o){const e=[];for(const t in o){const r=o[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var At=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,zt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,we=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class It extends re{constructor(){const e=ot.from({vertex:zt,fragment:At}),t=lt.from({fragment:{source:we,entryPoint:"mainFragment"},vertex:{source:we,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:S.WHITE.source,uSampler:new J({}),uniforms:{uTranslationMatrix:{value:new P,type:"mat3x3<f32>"},uColor:{value:new Be(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Ye{constructor(e,t){this.state=L.for2d(),this.localUniforms=new G({uTranslationMatrix:{value:new P,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new It,this.state=L.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new Dt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,n=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const a=this.state;n.update(t,e._childrenDirty),e._childrenDirty=!1,a.blendMode=te(e.blendMode,e.texture._source);const s=this.localUniforms.uniforms,i=s.uTranslationMatrix;e.worldTransform.copyTo(i),i.prepend(r.globalUniforms.globalUniformData.projectionMatrix),s.uResolution=r.globalUniforms.globalUniformData.resolution,s.uRound=r._roundPixels|e._roundPixels,V(e.groupColorAlpha,s.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class He extends Ye{constructor(e){super(e,new Mt)}}He.extension={type:[f.WebGLPipes],name:"particle"};class Xe extends Ye{constructor(e){super(e,new Ft)}}Xe.extension={type:[f.WebGPUPipes],name:"particle"};class Ot extends ne{constructor(){super(),this.geometry=new ut}destroy(){this.geometry.destroy()}}class $e{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new Ot,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}$e.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"nineSliceSprite"};const Lt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},Et={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let H,X;class Vt extends re{constructor(){H??(H=Me({name:"tiling-sprite-shader",bits:[Tt,Lt,Fe]})),X??(X=Ge({name:"tiling-sprite-shader",bits:[yt,Et,De]}));const e=new G({uMapCoord:{value:new P,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new P,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:X,gpuProgram:H,resources:{localUniforms:new G({uTransformMatrix:{value:new P,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:S.EMPTY.source,uSampler:S.EMPTY.source.style}})}updateUniforms(e,t,r,n,a,s){const i=this.resources.tilingUniforms,u=s.width,l=s.height,d=s.textureMatrix,c=i.uniforms.uTextureTransform;c.set(r.a*u/e,r.b*u/t,r.c*l/e,r.d*l/t,r.tx/e,r.ty/t),c.invert(),i.uniforms.uMapCoord=d.mapCoord,i.uniforms.uClampFrame=d.uClampFrame,i.uniforms.uClampOffset=d.uClampOffset,i.uniforms.uTextureTransform=c,i.uniforms.uSizeAnchor[0]=e,i.uniforms.uSizeAnchor[1]=t,i.uniforms.uSizeAnchor[2]=n,i.uniforms.uSizeAnchor[3]=a,s&&(this.resources.uTexture=s.source,this.resources.uSampler=s.source.style)}}class Wt extends ke{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function Yt(o,e){const t=o.anchor.x,r=o.anchor.y;e[0]=-t*o.width,e[1]=-r*o.height,e[2]=(1-t)*o.width,e[3]=-r*o.height,e[4]=(1-t)*o.width,e[5]=(1-r)*o.height,e[6]=-t*o.width,e[7]=(1-r)*o.height}function Ht(o,e,t,r){let n=0;const a=o.length/e,s=r.a,i=r.b,u=r.c,l=r.d,d=r.tx,c=r.ty;for(t*=e;n<a;){const h=o[t],p=o[t+1];o[t]=s*h+u*p+d,o[t+1]=i*h+l*p+c,t+=e,n++}}function Xt(o,e){const t=o.texture,r=t.frame.width,n=t.frame.height;let a=0,s=0;o.applyAnchorToTexture&&(a=o.anchor.x,s=o.anchor.y),e[0]=e[6]=-a,e[2]=e[4]=1-a,e[1]=e[3]=-s,e[5]=e[7]=1-s;const i=P.shared;i.copyFrom(o._tileTransform.matrix),i.tx/=o.width,i.ty/=o.height,i.invert(),i.scale(o.width/r,o.height/n),Ht(e,2,0,i)}const z=new Wt;class $t{constructor(){this.canBatch=!0,this.geometry=new ke({indices:z.indices.slice(),positions:z.positions.slice(),uvs:z.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class je{constructor(e){this._state=L.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const n=t.canBatch;if(n&&n===r){const{batchableMesh:a}=t;return!a._batcher.checkAndUpdateTexture(a,e.texture)}return r!==n}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const n=this._getTilingSpriteData(e),{geometry:a,canBatch:s}=n;if(s){n.batchableMesh||(n.batchableMesh=new ne);const i=n.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),i.geometry=a,i.renderable=e,i.transform=e.groupTransform,i.setTexture(e._texture)),i.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(i,t)}else r.break(t),n.shader||(n.shader=new Vt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,V(e.groupColorAlpha,r.uColor,0),this._state.blendMode=te(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:z,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:n}=t;e.didViewUpdate&&this._updateBatchableMesh(e),n._batcher.updateElement(n)}else if(e.didViewUpdate){const{shader:n}=t;n.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new $t;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,n=e.texture.source.style;n.addressMode!=="repeat"&&(n.addressMode="repeat",n.update()),Xt(e,r.uvs),Yt(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let n=!0;return this._renderer.type===ee.WEBGL&&(n=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(n||r.source.isPowerOfTwo),t.canBatch}}je.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"tilingSprite"};const jt={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},qt={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},Nt={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Qt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let $,j;class Jt extends re{constructor(e){const t=new G({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new P,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});$??($=Me({name:"sdf-shader",bits:[ct,dt(e),jt,Nt,Fe]})),j??(j=Ge({name:"sdf-shader",bits:[ht,ft(e),qt,Qt,De]})),super({glProgram:j,gpuProgram:$,resources:{localUniforms:t,batchSamplers:pt(e)}})}}class Kt extends xt{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class qe{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);Pe(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);Pe(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,n=mt.getFont(e.text,e._style);r.clear(),n.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Jt(this._renderer.limits.maxBatchableTextures)));const a=F.graphemeSegmenter(e.text),s=e._style;let i=n.baseLineOffset;const u=gt(a,s,n,!0),l=s.padding,d=u.scale;let c=u.width,h=u.height+u.offsetY;s._stroke&&(c+=s._stroke.width/d,h+=s._stroke.width/d),r.translate(-e._anchor._x*c-l,-e._anchor._y*h-l).scale(d,d);const p=n.applyFillAsTint?s._fill.color:16777215;let x=n.fontMetrics.fontSize,_=n.lineHeight;s.lineHeight&&(x=s.fontSize/d,_=s.lineHeight/d);let g=(_-x)/2;g-n.baseLineOffset<0&&(g=0);for(let m=0;m<u.lines.length;m++){const B=u.lines[m];for(let U=0;U<B.charPositions.length;U++){const D=B.chars[U],v=n.chars[D];if(v!=null&&v.texture){const M=v.texture;r.texture(M,p||"black",Math.round(B.charPositions[U]+v.xOffset),Math.round(i+v.yOffset+g),M.orig.width,M.orig.height)}}i+=_}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Kt;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,n=K.get(`${r}-bitmap`),{a,b:s,c:i,d:u}=e.groupTransform,l=Math.sqrt(a*a+s*s),d=Math.sqrt(i*i+u*u),c=(Math.abs(l)+Math.abs(d))/2,h=n.baseRenderedFontSize/e._style.fontSize,p=c*n.distanceField.range*(1/h);t.customShader.resources.localUniforms.uniforms.uDistance=p}destroy(){this._renderer=null}}qe.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"bitmapText"};function Pe(o,e){e.groupTransform=o.groupTransform,e.groupColorAlpha=o.groupColorAlpha,e.groupColor=o.groupColor,e.groupBlendMode=o.groupBlendMode,e.globalDisplayStatus=o.globalDisplayStatus,e.groupTransform=o.groupTransform,e.localDisplayStatus=o.localDisplayStatus,e.groupAlpha=o.groupAlpha,e._roundPixels=o._roundPixels}class Zt extends Ae{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function Z(o,e){const{texture:t,bounds:r}=o,n=e._style._getFinalPadding();_t(r,e._anchor,t);const a=e._anchor._x*n*2,s=e._anchor._y*n*2;r.minX-=n-a,r.minY-=n-s,r.maxX-=n-a,r.maxY-=n-s}class Ne{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(n=>{console.error(n)}),e._didTextUpdate=!1,Z(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const n=e.renderGroup||e.parentRenderGroup;n&&(n.structureDidChange=!0),t.generatingTexture=!1,Z(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Zt(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=S.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ne.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"htmlText"};function er(){const{userAgent:o}=E.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(o)}const tr=new Re;function Qe(o,e,t,r){const n=tr;n.minX=0,n.minY=0,n.maxX=o.width/r|0,n.maxY=o.height/r|0;const a=y.getOptimalTexture(n.width,n.height,r,!1);return a.source.uploadMethodId="image",a.source.resource=o,a.source.alphaMode="premultiply-alpha-on-upload",a.frame.width=e/r,a.frame.height=t/r,a.source.emit("update",a.source),a.updateUvs(),a}function rr(o,e){const t=e.fontFamily,r=[],n={},a=/font-family:([^;"\s]+)/g,s=o.match(a);function i(u){n[u]||(r.push(u),n[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)i(t[u]);else i(t);s&&s.forEach(u=>{const l=u.split(":")[1].trim();i(l)});for(const u in e.tagStyles){const l=e.tagStyles[u].fontFamily;i(l)}return r}async function nr(o){const t=await(await E.get().fetch(o)).blob(),r=new FileReader;return await new Promise((a,s)=>{r.onloadend=()=>a(r.result),r.onerror=s,r.readAsDataURL(t)})}async function ar(o,e){const t=await nr(e);return`@font-face {
        font-family: "${o.fontFamily}";
        font-weight: ${o.fontWeight};
        font-style: ${o.fontStyle};
        src: url('${t}');
    }`}const q=new Map;async function sr(o){const e=o.filter(t=>K.has(`${t}-and-url`)).map(t=>{if(!q.has(t)){const{entries:r}=K.get(`${t}-and-url`),n=[];r.forEach(a=>{const s=a.url,u=a.faces.map(l=>({weight:l.weight,style:l.style}));n.push(...u.map(l=>ar({fontWeight:l.weight,fontStyle:l.style,fontFamily:t},s)))}),q.set(t,Promise.all(n).then(a=>a.join(`
`)))}return q.get(t)});return(await Promise.all(e)).join(`
`)}function ir(o,e,t,r,n){const{domElement:a,styleElement:s,svgRoot:i}=n;a.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${o}</div>`,a.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),s.textContent=r;const{width:u,height:l}=n.image;return i.setAttribute("width",u.toString()),i.setAttribute("height",l.toString()),new XMLSerializer().serializeToString(i)}function or(o,e){const t=I.getOptimalCanvasAndContext(o.width,o.height,e),{context:r}=t;return r.clearRect(0,0,o.width,o.height),r.drawImage(o,0,0),t}function lr(o,e,t){return new Promise(async r=>{t&&await new Promise(n=>setTimeout(n,100)),o.onload=()=>{r()},o.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,o.crossOrigin="anonymous"})}class Je{constructor(e){this._renderer=e,this._createCanvas=e.type===ee.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:n,textureStyle:a}=e,s=O.get(Ee),i=rr(t,r),u=await sr(i),l=Rt(t,r,u,s),d=Math.ceil(Math.ceil(Math.max(1,l.width)+r.padding*2)*n),c=Math.ceil(Math.ceil(Math.max(1,l.height)+r.padding*2)*n),h=s.image,p=2;h.width=(d|0)+p,h.height=(c|0)+p;const x=ir(t,r,n,u,s);await lr(h,x,er()&&i.length>0);const _=h;let g;this._createCanvas&&(g=or(h,n));const m=Qe(g?g.canvas:_,h.width-p,h.height-p,n);return a&&(m.source.style=a),this._createCanvas&&(this._renderer.texture.initSource(m.source),I.returnCanvasAndContext(g)),O.return(s),m}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{Ue("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){y.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}Je.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"htmlText"};class ur extends Ae{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Ke{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=this._renderer.canvasText.getTexture(e),Z(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new ur(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ke.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"text"};class Ze{constructor(e){this._renderer=e}getTexture(e,t,r,n){typeof e=="string"&&(he("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof fe||(e.style=new fe(e.style)),e.textureStyle instanceof J||(e.textureStyle=new J(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:a,style:s,textureStyle:i}=e,u=e.resolution??this._renderer.resolution,{frame:l,canvasAndContext:d}=Y.getCanvasAndContext({text:a,style:s,resolution:u}),c=Qe(d.canvas,l.width,l.height,u);if(i&&(c.source.style=i),s.trim&&(l.pad(s.padding),c.frame.copyFrom(l),c.frame.scale(1/u),c.updateUvs()),s.filters){const h=this._applyFilters(c,s.filters);return this.returnTexture(c),Y.returnCanvasAndContext(d),h}return this._renderer.texture.initSource(c._source),Y.returnCanvasAndContext(d),c}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",y.returnTexture(e,!0)}renderTextToCanvas(){he("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,n=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),n}destroy(){this._renderer=null}}Ze.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"canvasText"};T.add(ze);T.add(Ie);T.add(Ve);T.add(bt);T.add(We);T.add(He);T.add(Xe);T.add(Ze);T.add(Ke);T.add(qe);T.add(Je);T.add(Ne);T.add(je);T.add($e);T.add(Le);T.add(Oe);
