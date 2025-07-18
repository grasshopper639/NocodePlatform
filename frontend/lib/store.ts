import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CodeOutput {
  jsx?: string;
  html?: string;
  css?: string;
  javascript?: string;
  typescript?: string;
  error?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
}

interface Component {
  id: string;
  name: string;
  type: 'component' | 'page' | 'api';
  code: CodeOutput;
  position: { x: number; y: number };
}

interface AppState {
  // Current project
  currentProject: Project | null;
  
  // UI state
  isLoading: boolean;
  selectedComponent: Component | null;
  draggedComponent: Component | null;
  
  // Code generation
  generationHistory: Array<{
    prompt: string;
    output: CodeOutput;
    timestamp: Date;
  }>;
  
  // Actions
  setCurrentProject: (project: Project) => void;
  setSelectedComponent: (component: Component | null) => void;
  setDraggedComponent: (component: Component | null) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  addToHistory: (prompt: string, output: CodeOutput) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        currentProject: null,
        isLoading: false,
        selectedComponent: null,
        draggedComponent: null,
        generationHistory: [],
        
        setCurrentProject: (project) => set({ currentProject: project }),
        
        setSelectedComponent: (component) => set({ selectedComponent: component }),
        
        setDraggedComponent: (component) => set({ draggedComponent: component }),
        
        addComponent: (component) => {
          const { currentProject } = get();
          if (currentProject) {
            const updatedProject = {
              ...currentProject,
              components: [...currentProject.components, component],
              updatedAt: new Date()
            };
            set({ currentProject: updatedProject });
          }
        },
        
        updateComponent: (id, updates) => {
          const { currentProject } = get();
          if (currentProject) {
            const updatedComponents = currentProject.components.map(comp =>
              comp.id === id ? { ...comp, ...updates } : comp
            );
            const updatedProject = {
              ...currentProject,
              components: updatedComponents,
              updatedAt: new Date()
            };
            set({ currentProject: updatedProject });
          }
        },
        
        removeComponent: (id) => {
          const { currentProject } = get();
          if (currentProject) {
            const updatedComponents = currentProject.components.filter(comp => comp.id !== id);
            const updatedProject = {
              ...currentProject,
              components: updatedComponents,
              updatedAt: new Date()
            };
            set({ currentProject: updatedProject });
          }
        },
        
        addToHistory: (prompt, output) => {
          const { generationHistory } = get();
          set({
            generationHistory: [
              ...generationHistory,
              { prompt, output, timestamp: new Date() }
            ].slice(-50) // Keep last 50 generations
          });
        },
        
        setLoading: (loading) => set({ isLoading: loading })
      }),
      {
        name: 'nocode-platform-store',
        partialize: (state) => ({
          currentProject: state.currentProject,
          generationHistory: state.generationHistory
        })
      }
    )
  )
);
