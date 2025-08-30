"use client"

import { useRef } from "react"
import { Editor } from "@monaco-editor/react"
import { useTheme } from "next-themes"

interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  language: string
  height?: string
  readOnly?: boolean
  options?: any
}

export function MonacoEditor({
  value,
  onChange,
  language,
  height = "400px",
  readOnly = false,
  options = {},
}: MonacoEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure Monaco for better React/JSX support
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    })

    // Add React types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export interface FC<P = {}> {
          (props: P): JSX.Element | null;
        }
        export function useState<T>(initialState: T): [T, (value: T) => void];
        export function useEffect(effect: () => void, deps?: any[]): void;
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export const Fragment: FC<{ children?: any }>;
      }
      
      declare global {
        namespace JSX {
          interface Element {}
          interface IntrinsicElements {
            [elemName: string]: any;
          }
        }
      }
      `,
      "file:///node_modules/@types/react/index.d.ts",
    )
  }

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    tabSize: 2,
    insertSpaces: true,
    wordWrap: "on" as const,
    automaticLayout: true,
    readOnly,
    folding: true,
    lineNumbers: "on" as const,
    glyphMargin: false,
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorBlinking: "smooth" as const,
    cursorSmoothCaretAnimation: "on" as const,
    renderLineHighlight: "gutter" as const,
    selectOnLineNumbers: true,
    roundedSelection: false,
    renderIndentGuides: true,
    colorDecorators: true,
    codeLens: false,
    ...options,
  }

  return (
    <div className="border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange?.(value || "")}
        onMount={handleEditorDidMount}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-navy-800">
            <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
          </div>
        }
      />
    </div>
  )
}
