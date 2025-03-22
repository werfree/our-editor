export const SupportedLanguages = [
  { name: "C", value: "c" },
  { name: "C++", value: "cpp" },
  { name: "C#", value: "csharp" },
  { name: "CSS", value: "css" },
  { name: "Dart", value: "dart" },
  { name: "Dockerfile", value: "dockerfile" },
  { name: "Go", value: "go" },
  { name: "GraphQL", value: "graphql" },
  { name: "HTML", value: "html" },
  { name: "Java", value: "java" },
  { name: "JavaScript", value: "javascript" },
  { name: "JSON", value: "json" },
  { name: "Lua", value: "lua" },
  { name: "Markdown", value: "markdown" },
  { name: "MySQL", value: "mysql" },
  { name: "Objective-C", value: "objective-c" },
  { name: "Pascal", value: "pascal" },
  { name: "Perl", value: "perl" },
  { name: "PostgreSQL", value: "pgsql" },
  { name: "Plain Text", value: "plaintext" },
  { name: "Python", value: "python" },
  { name: "Ruby", value: "ruby" },
  { name: "Rust", value: "rust" },
  { name: "SQL", value: "sql" },
  { name: "Swift", value: "swift" },
  { name: "TypeScript", value: "typescript" },
  { name: "XML", value: "xml" },
  { name: "YAML", value: "yaml" },
];

export const EditorTheme = [
  {
    displayName: "Light",
    name: "IDLE",
    value: "idle",
  },
  { displayName: "Dark", value: "monokai" },
];

export const getLanguageName = (value) => {
  return SupportedLanguages.find((l) => l.value === value)?.name ?? "";
};
