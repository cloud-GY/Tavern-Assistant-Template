<template>
  <div
    class="relative mx-auto flex w-fit flex-col items-center overflow-x-hidden rounded-3xl transition-all duration-700"
    :style="{ background: state.ui.themes[state.ui.currentTheme].value }"
  >
    <!-- 顶部状态栏 -->
    <nav
      class="glass sticky top-0 z-[100] flex w-full items-center justify-between px-4 py-2 text-[11px] font-medium shadow-xl"
    >
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1.5 opacity-80"
          >🗺️ <span class="text-slate-300">{{ state.world.location || '未知地点' }}</span></span
        >
        <span class="flex items-center gap-1 font-mono tracking-wider text-pink-400"
          >⏰ <span>{{ state.world.time || '未知时间' }}</span></span
        >
      </div>

      <div class="flex items-center gap-3">
        <div class="relative flex items-center">
          <button
            class="group flex items-center gap-1.5 rounded-lg p-1.5 transition-all hover:bg-white/10 focus:outline-none"
            @click.stop="state.ui.settingsOpen = !state.ui.settingsOpen"
          >
            <svg
              :class="[
                'h-4 w-4 transition-transform duration-700',
                state.ui.settingsOpen ? 'rotate-90 text-pink-500' : 'opacity-70 group-hover:opacity-100',
              ]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-[9px] tracking-tighter uppercase opacity-40 transition-opacity group-hover:opacity-100"
              >设置</span
            >
          </button>

          <!-- 设置下拉菜单 -->
          <transition name="fade">
            <div
              v-if="state.ui.settingsOpen"
              class="glass-card absolute top-full right-0 z-[200] mt-2 w-56 overflow-hidden rounded-xl border border-pink-500/20 shadow-2xl"
            >
              <div class="space-y-5 p-4">
                <div>
                  <div
                    class="mb-3 border-b border-white/5 pb-1 text-[9px] font-bold tracking-widest text-pink-500/60 uppercase"
                  >
                    预设偏好
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-slate-300">面板默认展开</span>
                    <label class="switch">
                      <input v-model="state.ui.defaultExpanded" type="checkbox" />
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>

                <div>
                  <div
                    class="mb-3 border-b border-white/5 pb-1 text-[9px] font-bold tracking-widest text-pink-500/60 uppercase"
                  >
                    视觉环境
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="(theme, key) in state.ui.themes"
                      :key="key"
                      :class="[
                        'flex h-8 items-center justify-center rounded-lg border text-[9px] font-medium transition-all',
                        state.ui.currentTheme === key
                          ? 'border-pink-500 bg-pink-500/20 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
                          : 'border-white/10 text-white/60 hover:border-white/30',
                      ]"
                      @click="state.ui.currentTheme = key"
                    >
                      {{ theme.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </nav>

    <!-- 主容器 -->
    <main class="flex w-full max-w-xl flex-col gap-4 p-3 pt-4" @click="state.ui.settingsOpen = false">
      <!-- 角色面板 -->
      <section v-if="state.characters.length > 0" class="glass-card overflow-hidden rounded-2xl">
        <button
          class="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
          @click="state.ui.expanded.characters = !state.ui.expanded.characters"
        >
          <span class="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-300 uppercase">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-500"></span>
            角色状态监控
          </span>
          <svg
            :class="[
              'h-4 w-4 opacity-40 transition-transform duration-300',
              state.ui.expanded.characters ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <transition name="collapse">
          <div v-if="state.ui.expanded.characters" class="space-y-4 border-t border-white/5 px-4 pt-3 pb-4">
            <div v-for="(char, index) in state.characters" :key="index" class="group relative">
              <div class="mb-1.5 flex items-center justify-between">
                <span class="text-[13px] font-bold text-white/90">{{ char.name }}</span>
                <span class="rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] font-medium text-pink-400">{{
                  char.status
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-black/30 p-3">
                <div>
                  <div class="mb-1.5 text-[8px] font-bold tracking-wider text-slate-500 uppercase">具体状态</div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in char.tags"
                      :key="tag"
                      class="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
                      >{{ tag }}</span
                    >
                  </div>
                </div>
                <div class="text-right">
                  <div class="mb-1.5 text-[8px] font-bold tracking-wider text-slate-500 uppercase">态度</div>
                  <div class="text-[11px] leading-tight font-medium text-pink-300">{{ char.attitude }}</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>

      <!-- 系统与事项面板 -->
      <section class="glass-card overflow-hidden rounded-2xl">
        <button
          class="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
          @click="state.ui.expanded.matters = !state.ui.expanded.matters"
        >
          <span class="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-300 uppercase">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            事件脉络记录
          </span>
          <svg
            :class="[
              'h-4 w-4 opacity-40 transition-transform duration-300',
              state.ui.expanded.matters ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <transition name="collapse">
          <div v-if="state.ui.expanded.matters" class="space-y-5 border-t border-white/5 px-4 pt-3 pb-4">
            <div v-if="state.system.progress !== undefined">
              <div class="mb-2 flex items-end justify-between">
                <div class="flex flex-col">
                  <span class="text-[10px] font-black tracking-tighter text-pink-500 uppercase">{{
                    state.system.progressLabel || '进度'
                  }}</span>
                  <span class="text-[9px] font-medium text-slate-400 opacity-90">{{
                    state.system.progressStatus
                  }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono text-xs font-bold text-pink-500">{{ state.system.progress }}%</span>
                  <span v-if="state.system.progressDelta !== undefined" class="font-mono text-[10px] text-slate-400">
                    ({{ state.system.progressDelta >= 0 ? '+' : '' }}{{ state.system.progressDelta }}%)
                  </span>
                </div>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full border border-white/5 bg-black/40">
                <div
                  class="pink-glow h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-1000 ease-out"
                  :style="{ width: state.system.progress + '%' }"
                ></div>
              </div>
            </div>

            <div
              v-if="state.system.importantMatter"
              class="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-3.5"
            >
              <div
                class="mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-widest text-pink-400 uppercase"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                重要事项
              </div>
              <p class="text-[12px] leading-relaxed text-slate-200 italic opacity-90">
                {{ state.system.importantMatter }}
              </p>
            </div>
          </div>
        </transition>
      </section>

      <!-- 剧情走向面板 -->
      <section
        v-if="state.story.potentialOutcomes.length > 0 || state.story.options.length > 0"
        class="glass-card rounded-2xl border-white/10 p-5"
      >
        <h2 class="mb-5 flex items-center gap-2 text-[11px] font-black tracking-[0.3em] text-pink-500 uppercase">
          <span class="h-3.5 w-1 rounded-full bg-pink-500"></span>
          剧情即时走向
        </h2>
        <div class="space-y-3">
          <div
            v-for="(outcome, index) in state.story.potentialOutcomes"
            :key="index"
            class="group flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[12px] transition-all hover:border-pink-500/40 hover:bg-white/10"
            :class="{ 'border-pink-500/60 bg-pink-500/10': state.ui.selectedOutcome === outcome }"
            @click="selectOutcome(outcome)"
          >
            <span class="pt-0.5 font-mono font-bold text-pink-500 opacity-60">0{{ index + 1 }}</span>
            <span class="leading-snug text-slate-200 transition-colors group-hover:text-white">{{ outcome }}</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            v-for="opt in state.story.options"
            :key="opt.id"
            class="glass-card group relative overflow-hidden rounded-2xl p-4 text-left hover:border-pink-500/40 hover:bg-pink-500/10 active:scale-[0.98]"
            :class="{ 'border-pink-500/60 bg-pink-500/20': state.ui.selectedOptionId === opt.id }"
            @click="selectOption(opt)"
          >
            <div class="absolute top-0 right-0 h-12 w-12 translate-x-6 -translate-y-6 rotate-45 bg-pink-500/5"></div>
            <div class="mb-1 text-[9px] font-black tracking-widest text-pink-500 uppercase opacity-80">
              指令 {{ opt.id }}
            </div>
            <div class="text-[12px] font-bold text-slate-200 group-hover:text-white">{{ opt.label }}</div>
          </button>
        </div>
      </section>
    </main>

    <!-- 底部导航栏 -->
    <footer v-if="state.statusFloors.length > 1" class="w-full max-w-xl px-3 pb-2">
      <div class="glass-card flex items-center justify-between rounded-2xl p-1">
        <button
          class="rounded-xl p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-20"
          :disabled="state.currentFloorIndex <= 0"
          @click="goToFloor(state.currentFloorIndex - 1)"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          class="flex cursor-pointer flex-col items-center transition-colors hover:text-pink-400"
          @click="state.ui.floorPickerOpen = true"
        >
          <span class="font-mono text-[11px] font-bold text-white"
            >{{ state.currentFloorIndex + 1 }} / {{ state.statusFloors.length }}</span
          >
        </div>

        <button
          class="rounded-xl p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-20"
          :disabled="state.currentFloorIndex >= state.statusFloors.length - 1"
          @click="goToFloor(state.currentFloorIndex + 1)"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </footer>

    <!-- 楼层选择弹窗 -->
    <transition name="fade">
      <div
        v-if="state.ui.floorPickerOpen"
        class="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
        @click="state.ui.floorPickerOpen = false"
      >
        <div class="glass-card flex max-h-[70vh] w-full max-w-xs flex-col overflow-hidden rounded-3xl" @click.stop>
          <div class="flex items-center justify-between border-b border-white/10 p-4">
            <span class="text-sm font-bold tracking-widest uppercase text-slate-400">选择楼层</span>
            <button class="opacity-50 hover:opacity-100" @click="state.ui.floorPickerOpen = false">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-1 overflow-y-auto p-2">
            <button
              v-for="(floor, index) in state.statusFloors"
              :key="index"
              class="group flex w-full items-center justify-between rounded-xl p-3 text-left transition-all"
              :class="
                state.currentFloorIndex === index
                  ? 'border border-pink-500/30 bg-pink-500/20 text-pink-300'
                  : 'hover:bg-white/5'
              "
              @click="
                goToFloor(index);
                state.ui.floorPickerOpen = false;
              "
            >
              <span class="font-mono text-xs text-slate-400">Floor {{ index + 1 }}</span>
              <span
                v-if="state.currentFloorIndex === index"
                class="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, watchEffect } from 'vue';

// Simple deep clone to avoid klona dependency in browser
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

interface Character {
  name: string;
  status: string;
  tags: string[];
  attitude: string;
}

interface Option {
  id: string;
  label: string;
}

interface State {
  world: {
    time: string;
    location: string;
  };
  characters: Character[];
  system: {
    progress?: number;
    progressLabel?: string;
    progressStatus?: string;
    progressDelta?: number;
    importantMatter?: string;
  };
  story: {
    potentialOutcomes: string[];
    options: Option[];
  };
  ui: {
    settingsOpen: boolean;
    defaultExpanded: boolean;
    currentTheme: string;
    themes: Record<string, { label: string; value: string }>;
    expanded: {
      characters: boolean;
      matters: boolean;
    };
    selectedOutcome: string;
    selectedOptionId: string;
    selectedOptionLabel: string;
    floorPickerOpen: boolean;
  };
  statusFloors: string[];
  currentFloorIndex: number;
}

const chatdata = `
<Status_block>
  时间:  Day-3 22:15
  地点:  霓虹市 · 废弃工业区

名字: 艾莉丝
         状态: 警戒 / 义体过热
         具体状态:
          - 视觉传感器受损
          - 核心温度 85°C
        对xxx的态度: 信任但充满疑虑
名字: 由莉
         状态: 担忧
         具体状态:
          - 这里有一段文字
          - 这里有一段文字
        对xxx的态度: 这里有一段文字

         堕落值: 45
         进度: 开始堕落，进入堕落中期
         重要事项: 区域内的电磁干扰正在加强。

         可能的发展:
          -  成功突破封锁线
          -  陷入无尽的巷战
          -  被赶来的敌人围困
      选项:
      - A. [强攻] 集中火力攻击正门。
      - B. [潜入] 寻找通风管道绕过守卫。
      - C. [xx] 选项C
      - D. [xx] 选项D
</Status_block>
`;

const state = reactive<State>({
  world: { time: '', location: '' },
  characters: [],
  system: {},
  story: { potentialOutcomes: [], options: [] },
  ui: {
    settingsOpen: false,
    defaultExpanded: false,
    currentTheme: 'midnight',
    themes: {
      midnight: { label: '午夜霓虹', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
      abyss: { label: '深渊之底', value: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' },
      cyber: { label: '赛博矩阵', value: 'linear-gradient(135deg, #001a1a 0%, #003333 100%)' },
      wild: { label: '暮色荒野', value: 'linear-gradient(135deg, #1a0f0f 0%, #3b1e1e 100%)' },
    },
    expanded: {
      characters: true,
      matters: true,
    },
    selectedOutcome: '',
    selectedOptionId: '',
    selectedOptionLabel: '',
    floorPickerOpen: false,
  },
  statusFloors: [],
  currentFloorIndex: -1,
});

function parseStatus(text: string) {
  const blockMatch = text.match(/<Status_block>([\s\S]*?)<\/Status_block>/);
  if (!blockMatch) return;
  const content = blockMatch[1];

  // Parse World
  const timeMatch = content.match(/时间:\s*(.*)/);
  if (timeMatch) state.world.time = timeMatch[1].trim();
  const locationMatch = content.match(/地点:\s*(.*)/);
  if (locationMatch) state.world.location = locationMatch[1].trim();

  // Parse Characters
  const charBlocks = content.split(/名字:/).slice(1);
  state.characters = charBlocks.map(block => {
    const lines = block.split('\n');
    const name = lines[0].trim();
    const statusMatch = block.match(/状态:\s*(.*)/);
    const attitudeMatch = block.match(/对.*的态度:\s*(.*)/);

    const tags: string[] = [];
    const specificStatusMatch = block.match(/具体状态:([\s\S]*?)(?=\n\s*[^-\s].*[:：]|$)/);
    if (specificStatusMatch) {
      const tagLines = specificStatusMatch[1].split('\n');
      tagLines.forEach(line => {
        const m = line.match(/-\s*(.*)/);
        if (m) tags.push(m[1].trim());
      });
    }

    return {
      name,
      status: statusMatch ? statusMatch[1].trim() : '',
      tags,
      attitude: attitudeMatch ? attitudeMatch[1].trim() : '',
    };
  });

  // Parse System
  const progressValMatch = content.match(/(.{1,4}值)\s*[:：]\s*(\d+)/);
  if (progressValMatch) {
    state.system.progressLabel = progressValMatch[1].trim();
    const newVal = parseInt(progressValMatch[2]);

    // 计算变动量
    if (state.currentFloorIndex > 0) {
      const prevContent = state.statusFloors[state.currentFloorIndex - 1];
      const prevMatch = prevContent.match(new RegExp(`${state.system.progressLabel}\\s*[:：]\\s*(\\d+)`));
      if (prevMatch) {
        state.system.progressDelta = newVal - parseInt(prevMatch[1]);
      } else {
        state.system.progressDelta = undefined;
      }
    } else {
      state.system.progressDelta = undefined;
    }

    state.system.progress = newVal;
  }
  const progressStatusMatch = content.match(/进度:\s*(.*)/);
  if (progressStatusMatch) state.system.progressStatus = progressStatusMatch[1].trim();
  const importantMatch = content.match(/重要事项:\s*(.*)/);
  if (importantMatch) state.system.importantMatter = importantMatch[1].trim();

  // Parse Story
  const outcomesMatch = content.match(/可能的发展:([\s\S]*?)(?=选项|$)/);
  if (outcomesMatch) {
    state.story.potentialOutcomes = outcomesMatch[1]
      .split('\n')
      .map(l => l.match(/-\s*(.*)/)?.[1]?.trim())
      .filter((l): l is string => !!l);
  }

  const optionsMatch = content.match(/选项:([\s\S]*?)$/);
  if (optionsMatch) {
    state.story.options = optionsMatch[1]
      .split('\n')
      .map(l => {
        const m = l.match(/-\s*([A-Z])\.\s*(.*)/);
        if (m) return { id: m[1], label: m[2].trim() };
        return null;
      })
      .filter((o): o is Option => !!o);
  }
}

function updateData() {
  let messages: any[] = [];
  try {
    if (typeof getChatMessages === 'function') {
      messages = getChatMessages('0-{{lastMessageId}}');
    }
  } catch (e) {
    console.warn('Failed to get chat messages, using default data.');
  }

  const newFloors: string[] = [];
  if (Array.isArray(messages)) {
    messages.forEach(m => {
      if (m?.message?.includes('<Status_block>')) {
        newFloors.push(m.message);
      }
    });
  }

  if (newFloors.length === 0) {
    newFloors.push(chatdata);
  }

  const isAtLast = state.currentFloorIndex === state.statusFloors.length - 1 || state.currentFloorIndex === -1;
  state.statusFloors = newFloors;

  if (isAtLast) {
    state.currentFloorIndex = newFloors.length - 1;
  } else {
    // 保持当前索引，但确保不越界
    state.currentFloorIndex = Math.min(state.currentFloorIndex, newFloors.length - 1);
  }

  if (state.currentFloorIndex >= 0) {
    parseStatus(state.statusFloors[state.currentFloorIndex]);
  }
}

function goToFloor(index: number) {
  if (index >= 0 && index < state.statusFloors.length) {
    state.currentFloorIndex = index;
    parseStatus(state.statusFloors[index]);
  }
}

function updateInputBox() {
  let text = '';
  if (state.ui.selectedOptionId) {
    text += `${state.ui.selectedOptionId}.${state.ui.selectedOptionLabel}`;
  }
  if (state.ui.selectedOutcome) {
    if (text) text += '\n';
    text += `（${state.ui.selectedOutcome}）`;
  }

  if (typeof triggerSlash === 'function') {
    triggerSlash(`/setinput ${text}`);
  } else {
    console.log('Set input:', text);
  }
}

function selectOutcome(outcome: string) {
  if (state.ui.selectedOutcome === outcome) {
    state.ui.selectedOutcome = '';
  } else {
    state.ui.selectedOutcome = outcome;
  }
  updateInputBox();
}

function selectOption(opt: Option) {
  if (state.ui.selectedOptionId === opt.id) {
    state.ui.selectedOptionId = '';
    state.ui.selectedOptionLabel = '';
  } else {
    state.ui.selectedOptionId = opt.id;
    state.ui.selectedOptionLabel = opt.label;
  }
  updateInputBox();
}

// 持久化设置加载
function loadSettings() {
  try {
    if (typeof getVariables === 'function' && typeof getScriptId === 'function') {
      const savedSettings = getVariables({ type: 'script', script_id: getScriptId() });
      if (savedSettings && typeof savedSettings === 'object') {
        // 深度合并，防止覆盖整个 ui 对象
        Object.assign(state.ui, savedSettings);
      }
    }
  } catch (e) {
    console.warn('Failed to load settings from tavern variables.');
  }
}

onMounted(() => {
  loadSettings();
  updateData();
  // 监听消息变化
  if (typeof eventOn === 'function') {
    eventOn(tavern_events.CHAT_CHANGED, updateData);
    eventOn(tavern_events.MESSAGE_UPDATED, updateData);
  }

  // 初始化展开状态：仅当没有手动操作过时才应用默认值
  state.ui.expanded.characters = state.ui.defaultExpanded;
  state.ui.expanded.matters = state.ui.defaultExpanded;
});

// 监听默认展开设置的变化，实时应用
watch(
  () => state.ui.defaultExpanded,
  newVal => {
    state.ui.expanded.characters = newVal;
    state.ui.expanded.matters = newVal;
  },
);

watchEffect(() => {
  try {
    if (typeof replaceVariables === 'function' && typeof getScriptId === 'function') {
      replaceVariables(deepClone(state.ui), { type: 'script', script_id: getScriptId() });
    }
  } catch (e) {
    // Ignore error in non-tavern environment
  }
});
</script>

<style lang="scss">
@import './style.css';

:root {
  --pink-accent: 236, 72, 153;
}

html,
body {
  background: transparent !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.glass {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px -2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: rgba(var(--pink-accent), 0.3);
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-height: 1000px;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.4s;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: rgba(var(--pink-accent), 0.4);
  border-color: rgba(var(--pink-accent), 0.6);
}
input:checked + .slider:before {
  transform: translateX(14px);
  background-color: rgb(var(--pink-accent));
}

.bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.pink-glow {
  box-shadow: 0 0 15px rgba(var(--pink-accent), 0.5);
}
</style>
