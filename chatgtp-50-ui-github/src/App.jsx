import React, { useEffect, useRef, useState } from "react";
import { Search, Mic, Plus, Library, ChevronDown, Upload, Image as ImageIcon, Play, PencilRuler, Github, MessageSquare, Settings, Wand2, Bot, User, Send, Loader2, PanelLeft } from "lucide-react";

const cls = (...s) => s.filter(Boolean).join(" ");

// 타이핑(스트리밍) 유틸
function streamText({ fullText, onChunk, onDone, delay = 30 }) {
  let i = 0;
  const id = setInterval(() => {
    onChunk(fullText[i] ?? "");
    i++;
    if (i >= fullText.length) {
      clearInterval(id);
      onDone?.();
    }
  }, delay);
  return () => clearInterval(id);
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={cls("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}> 
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-neutral-800 grid place-items-center shrink-0">
          <Bot size={16} />
        </div>
      )}
      <div className={cls(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap",
        isUser ? "bg-neutral-200/90 text-black" : "bg-white/90 backdrop-blur text-neutral-900"
      )}>
        {content}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-neutral-300 grid place-items-center shrink-0">
          <User size={16} />
        </div>
      )}
    </div>
  );
}

function SideItem({ icon: Icon, label, active=false }) {
  return (
    <button className={cls(
      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
      active ? "bg-white/10 text-white" : "text-neutral-200 hover:bg-white/5"
    )}>
      <Icon size={16} />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function ChatGTP50() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const listRef = useRef(null);
  const typingCancelRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const SPECIAL = '실수 없이 전 세계적으로 유명해 질 수 있는 1인극 대본을 만들어줘.';
  const SPECIAL_ANSWER = `제목 "비밀의 연대기"
장면 1
장소: 현대 도시의 번화가
캐릭터: 주인공인 조커(JOKER)와 그의 라이벌, 탐(TOM)
줄거리: 조커는 도시의 지하 세계에서 힘을 쌓고 있지만, 탐은 조커를 제치고 지배권을 뺏기 위해 음모를 꾸미고 있다. 두 사람은 번갈아가며 각자의 그룹을 이끌어가며 도시의 권력을 쟁탈한다.

장면 2
장소: 조커의 아지트
캐릭터: 조커와 그의 신뢰하는 부하들
줄거리: 조커는 자신의 부하들과 함께 탐의 음모를 파헤치고 도시를 지키기 위해 전쟁을 준비한다 그러나 그의 내부 소수파 중 한 명이 탐과 결탁하여 배신한다.`;

  function handleSubmit(e) {
    e?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed) return;
    setStarted(true);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");

    // 기존 타이핑 취소
    if (typingCancelRef.current) typingCancelRef.current();

    if (trimmed === SPECIAL) {
      setLoading(true);
      // 우선 비어있는 assistant 버블 추가
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      // 천천히 타이핑
      typingCancelRef.current = streamText({
        fullText: SPECIAL_ANSWER,
        delay: 20,
        onChunk: (ch) => {
          setMessages((m) => {
            const last = m[m.length - 1];
            if (!last || last.role !== "assistant") return [...m, { role: "assistant", content: ch }];
            return [...m.slice(0, -1), { ...last, content: last.content + ch }];
          });
        },
        onDone: () => {
          setLoading(false);
          typingCancelRef.current = null;
        },
      });
    } else {
      // 일반 가짜 응답 (지연 후 한 번에)
      setLoading(true);
      setTimeout(() => {
        setMessages((m) => [...m, { role: "assistant", content: `가짜 응답: “${trimmed}”에 대한 답변입니다.` }]);
        setLoading(false);
      }, 600);
    }
  }

  return (
    <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden">
      {/* 상단 바 */}
      <div className="h-12 border-b border-white/10 px-3 flex items-center gap-2">
        <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-white/10">
          <PanelLeft size={18} />
        </button>
        <div className="text-sm text-white/80">Whale</div>
        <div className="mx-auto text-sm text-white/60">—</div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10"><Settings size={18} /></button>
          <button className="p-2 rounded-lg hover:bg-white/10"><Github size={18} /></button>
          <div className="h-7 w-7 rounded-full bg-white/20 grid place-items-center text-xs">A</div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-3rem)]">
        {/* 사이드바 */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 h-full border-r border-white/10 bg-neutral-900/40 backdrop-blur px-3 py-4 hidden md:block">
            <div className="px-2 text-[13px] font-medium mb-3 text-white/80">ChatGTP 50</div>
            <div className="space-y-1">
              <SideItem icon={Plus} label="새 채팅" active />
              <SideItem icon={Search} label="채팅 검색" />
              <SideItem icon={Library} label="라이브러리" />
            </div>
            <div className="mt-5 space-y-1">
              <SideItem icon={Wand2} label="image generator" />
              <SideItem icon={PencilRuler} label="Codex" />
              <SideItem icon={Play} label="Frame Animator" />
            </div>
            <div className="mt-6 text-[12px] text-white/60 px-2">채팅</div>
            <div className="mt-2 space-y-1">
              <SideItem icon={MessageSquare} label="긴장 푸는 법" />
              <SideItem icon={MessageSquare} label="실수 덜 하는 법" />
              <SideItem icon={MessageSquare} label="말 잘하는 법" />
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <button className="w-full flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                <span>Plus</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </aside>
        )}

        {/* 본문 */}
        <main className="flex-1 relative">
          {/* 배경 */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(120,120,255,0.20),rgba(255,120,200,0.12)_40%,rgba(0,0,0,0)_70%)]" />

          {/* 히어로 (대화 전) */}
          {!started && (
            <div className="h-full w-full grid place-items-center px-6">
              <div className="max-w-2xl text-center">
                <div className="mb-2 text-[13px] text-white/60">ChatGTP 50</div>
                <h1 className="text-2xl md:text-3xl font-semibold">GTP-50를 만나보세요</h1>
                <p className="mt-2 text-sm md:text-[15px] text-white/70 leading-6">
                  ChatGTP가 이제 사고력을 장착한, OpenAI에서 가장 빠르고 유용하며 스마트한 모델과 함께합니다. — 언제나 최고의 답변을 받아보세요.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 mx-auto max-w-2xl">
                  <div className="group flex items-center gap-2 rounded-2xl bg-white/10 focus-within:bg-white/15 px-3 py-2 ring-1 ring-white/10">
                    <Search size={18} className="opacity-80" />
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="무엇이든 물어보세요"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      className="flex-1 resize-none bg-transparent outline-none placeholder:text-white/50 text:[15px] leading-6 py-1"
                    />
                    <button type="button" className="p-2 rounded-xl hover:bg-white/10" title="음성 입력(데모)">
                      <Mic size={18} />
                    </button>
                    <button type="submit" className="p-2 rounded-xl hover:bg-white/10" title="전송">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 대화 영역 */}
          {started && (
            <div className="h-full flex flex-col">
              <div ref={listRef} className="flex-1 overflow-auto px-4 md:px-8 py-6 space-y-4">
                {messages.map((m, i) => (
                  <Bubble key={i} role={m.role} content={m.content} />
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text:white/70 text-sm">
                    <Loader2 className="animate-spin" size={16} /> 응답 생성 중…
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4 border-t border-white/10 bg-neutral-900/40 backdrop-blur">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="flex items-end gap-2 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:bg-white/15">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="메시지를 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      className="flex-1 resize-none bg-transparent outline-none placeholder:text-white/50 text-[15px] leading-6 py-2"
                    />
                    <button type="button" className="p-2 rounded-xl hover:bg-white/10" title="업로드">
                      <Upload size={18} />
                    </button>
                    <button type="button" className="p-2 rounded-xl hover:bg-white/10" title="이미지">
                      <ImageIcon size={18} />
                    </button>
                    <button type="submit" className="p-2 rounded-xl hover:bg-white/10" title="전송">
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="text-[12px] text-white/50 mt-2 px-2">이 페이지는 데모입니다. 실제 OpenAI 서비스나 상표와는 별개로 동작합니다.</div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
