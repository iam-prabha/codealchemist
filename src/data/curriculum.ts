/* ============================================================
   CodeAlchemist — Curriculum Data
   12 progressive concept layers (Fully Implemented)
   ============================================================ */

import type { Layer } from "@/types";

/** All 12 curriculum layer definitions */
export const CURRICULUM_LAYERS: Layer[] = [
    {
        id: 1,
        slug: "variables-immutability",
        title: "Variables & Immutability",
        subtitle: "The foundation of data storage",
        icon: "⚗️",
        description: "Learn how let, const, mut, and type annotations work across languages.",
        conceptIntro: {
            python: "# Python uses dynamic typing — variables don't need type annotations (but support them via type hints).",
            rust: "// Rust variables are immutable by default. Use `mut` to make them mutable.",
            typescript: "// TypeScript adds static types on top of JavaScript's let/const.",
        },
        exercises: [
            {
                id: "1-1-declarations",
                title: "Declaring Variables",
                instructions: "Declare a string 'name', an integer 'age', and a boolean 'is_active'. Print them out.",
                difficulty: 1,
                hints: ["Python uses type hints (name: str = '...')", "Rust uses let name: &str = '...'", "TS uses let name: string = '...'"],
                starterCode: {
                    python: `# Your code here\n\nprint(f"{name} {age} {is_active}")`,
                    rust: `fn main() {\n    // Your code here\n\n    println!("{} {} {}", name, age, is_active);\n}`,
                    typescript: `// Your code here\n\nconsole.log(\`\${name} \${age} \${isActive}\`);`
                },
                goldenExample: {
                    python: `name: str = "Alchemist"\nage: int = 42\nis_active: bool = True\n\nprint(f"{name} {age} {is_active}")`,
                    rust: `fn main() {\n    let name: &str = "Alchemist";\n    let age: i32 = 42;\n    let is_active: bool = true;\n\n    println!("{} {} {}", name, age, is_active);\n}`,
                    typescript: `let name: string = "Alchemist";\nlet age: number = 42;\nlet isActive: boolean = true;\n\nconsole.log(\`\${name} \${age} \${isActive}\`);`
                },
                annotations: {
                    python: { 1: "Type hints are optional but recommended", 4: "f-strings for string interpolation" },
                    rust: { 2: "&str is a string slice", 5: "println! is a macro (note the !)" },
                    typescript: { 1: "Static types ensure safety", 5: "Template literals use backticks" }
                },
                expectedOutput: {
                    python: "Alchemist 42 True",
                    rust: "Alchemist 42 true",
                    typescript: "Alchemist 42 true"
                }
            },
            {
                id: "1-2-swap",
                title: "Variable Swapping",
                instructions: "Swap the values of 'a' and 'b' without using a temporary variable.",
                difficulty: 2,
                hints: ["Python: use tuple unpacking a, b = b, a", "Rust: use std::mem::swap", "TS: use array destructuring [a, b] = [b, a]"],
                starterCode: {
                    python: `a = 10\nb = 20\n\n# Swap them!\n\nprint(f"a={a}, b={b}")`,
                    rust: `fn main() {\n    let mut a = 10;\n    let mut b = 20;\n\n    // Swap them!\n\n    println!("a={}, b={}", a, b);\n}`,
                    typescript: `let a = 10;\nlet b = 20;\n\n// Swap them!\n\nconsole.log(\`a=\${a}, b=\${b}\`);`
                },
                goldenExample: {
                    python: `a = 10\nb = 20\n\na, b = b, a\n\nprint(f"a={a}, b={b}")`,
                    rust: `fn main() {\n    let mut a = 10;\n    let mut b = 20;\n\n    std::mem::swap(&mut a, &mut b);\n\n    println!("a={}, b={}", a, b);\n}`,
                    typescript: `let a = 10;\nlet b = 20;\n\n[a, b] = [b, a];\n\nconsole.log(\`a=\${a}, b=\${b}\`);`
                },
                annotations: {
                    python: { 4: "Tuple unpacking makes swapping elegant and fast" },
                    rust: { 2: "Variables must be 'mut' to be swapped", 5: "Pass mutable references to swap()" },
                    typescript: { 4: "Array destructuring assignment" }
                },
                expectedOutput: {
                    python: "a=20, b=10",
                    rust: "a=20, b=10",
                    typescript: "a=20, b=10"
                }
            }
        ]
    },
    {
        id: 2,
        slug: "data-types",
        title: "Primitive & Compound Data Types",
        subtitle: "Numbers, strings, booleans, and beyond",
        icon: "🧪",
        description: "Explore primitives, tuples, arrays, and custom types in each language.",
        conceptIntro: {
            python: "# Python has int, float, str, bool, list, tuple, dict, set",
            rust: "// Rust has i32, f64, bool, char, String, &str, tuples, arrays",
            typescript: "// TypeScript has number, string, boolean, arrays, tuples, enums",
        },
        exercises: [
            {
                id: "2-1-tuples",
                title: "Tuples & Destructuring",
                instructions: "Create a tuple representing a 3D point (x: 3.0, y: 4.5, label: 'origin'). Destructure it into variables and calculate the 2D distance to the origin.",
                difficulty: 1,
                hints: ["Distance formula: sqrt(x^2 + y^2)", "Python uses x**2", "Rust uses x.powi(2) or x*x", "TS uses Math.pow or **"],
                starterCode: {
                    python: `point = (3.0, 4.5, 'origin')\n# Destructure and calculate\n`,
                    rust: `fn main() {\n    let point = (3.0_f64, 4.5_f64, "origin");\n    // Destructure and calculate\n}`,
                    typescript: `const point: [number, number, string] = [3.0, 4.5, 'origin'];\n// Destructure and calculate\n`
                },
                goldenExample: {
                    python: `point = (3.0, 4.5, 'origin')\nx, y, label = point\ndist = (x**2 + y**2)**0.5\nprint(f"{label}: {dist:.2f}")`,
                    rust: `fn main() {\n    let point = (3.0_f64, 4.5_f64, "origin");\n    let (x, y, label) = point;\n    let dist = (x * x + y * y).sqrt();\n    println!("{}: {:.2}", label, dist);\n}`,
                    typescript: `const point: [number, number, string] = [3.0, 4.5, 'origin'];\nconst [x, y, label] = point;\nconst dist = Math.sqrt(x**2 + y**2);\nconsole.log(\`\${label}: \${dist.toFixed(2)}\`);`
                },
                annotations: {
                    python: { 2: "Tuple unpacking", 3: "**0.5 is a fast way to get square root" },
                    rust: { 2: "f64 literal suffixes", 3: "Pattern matching destructuring", 4: ".sqrt() is a method on f64" },
                    typescript: { 1: "Tuple type annotation", 2: "Array destructuring" }
                },
                expectedOutput: {
                    python: "origin: 5.41",
                    rust: "origin: 5.41",
                    typescript: "origin: 5.41"
                }
            },
            {
                id: "2-2-stack",
                title: "Basic Collections",
                instructions: "Use a built-in collection (List/Vec/Array) to push 1, 2, 3, pop the last element, and print the remaining size.",
                difficulty: 2,
                hints: ["Python lists have append() and pop()", "Rust Vecs have push() and pop()", "TS arrays have push() and pop()"],
                starterCode: {
                    python: `items = []\n# Push 1, 2, 3\n# Pop and print it\n# Print size`,
                    rust: `fn main() {\n    let mut items: Vec<i32> = Vec::new();\n    // Push 1, 2, 3\n    // Pop and print it\n    // Print size\n}`,
                    typescript: `const items: number[] = [];\n// Push 1, 2, 3\n// Pop and print it\n// Print size`
                },
                goldenExample: {
                    python: `items = []\nitems.append(1)\nitems.append(2)\nitems.append(3)\nprint(items.pop())\nprint(len(items))`,
                    rust: `fn main() {\n    let mut items: Vec<i32> = Vec::new();\n    items.push(1);\n    items.push(2);\n    items.push(3);\n    println!("{}", items.pop().unwrap());\n    println!("{}", items.len());\n}`,
                    typescript: `const items: number[] = [];\nitems.push(1, 2, 3);\nconsole.log(items.pop());\nconsole.log(items.length);`
                },
                annotations: {
                    python: { 2: "append() adds to end", 5: "pop() removes and returns last item" },
                    rust: { 2: "Vec must be mutable", 6: "pop() returns an Option, unwrap() gets the value" },
                    typescript: { 2: "push() can take multiple arguments" }
                },
                expectedOutput: {
                    python: "3\n2",
                    rust: "3\n2",
                    typescript: "3\n2"
                }
            }
        ]
    },
    {
        id: 3,
        slug: "control-flow",
        title: "Control Flow & Pattern Matching",
        subtitle: "Conditionals, loops, and match expressions",
        icon: "🔀",
        description: "Master if/else, for/while loops, and powerful pattern matching.",
        conceptIntro: {
            python: "# Python uses indentation for blocks, 'elif', and match/case.",
            rust: "// Rust has if/else expressions, loops, and exhaustive match.",
            typescript: "// TypeScript inherits JS control flow and adds type narrowing.",
        },
        exercises: [
            {
                id: "3-1-conditionals",
                title: "Conditional Branching",
                instructions: "Write a function returning a grade: A (90+), B (80+), C (70+), D (60+), F.",
                difficulty: 1,
                hints: ["Python uses elif", "Rust if/else is an expression"],
                starterCode: {
                    python: `def get_grade(score: int) -> str:\n    pass\n\nprint(get_grade(85))`,
                    rust: `fn get_grade(score: u32) -> &'static str {\n    todo!()\n}\n\nfn main() {\n    println!("{}", get_grade(85));\n}`,
                    typescript: `function getGrade(score: number): string {\n    return "";\n}\n\nconsole.log(getGrade(85));`
                },
                goldenExample: {
                    python: `def get_grade(score: int) -> str:\n    if score >= 90: return "A"\n    elif score >= 80: return "B"\n    elif score >= 70: return "C"\n    elif score >= 60: return "D"\n    else: return "F"\n\nprint(get_grade(85))`,
                    rust: `fn get_grade(score: u32) -> &'static str {\n    if score >= 90 { "A" }\n    else if score >= 80 { "B" }\n    else if score >= 70 { "C" }\n    else if score >= 60 { "D" }\n    else { "F" }\n}\n\nfn main() {\n    println!("{}", get_grade(85));\n}`,
                    typescript: `function getGrade(score: number): string {\n    if (score >= 90) return "A";\n    else if (score >= 80) return "B";\n    else if (score >= 70) return "C";\n    else if (score >= 60) return "D";\n    else return "F";\n}\n\nconsole.log(getGrade(85));`
                },
                annotations: {
                    python: { 3: "elif allows chaining conditions cleanly" },
                    rust: { 2: "Expression returns value (no semicolon)" },
                    typescript: { 2: "Standard C-style syntax" }
                },
                expectedOutput: {
                    python: "B",
                    rust: "B",
                    typescript: "B"
                }
            },
            {
                id: "3-3-loop-patterns",
                title: "Loop Patterns & Iteration",
                instructions: "Given [1, 2, 3, 4, 5], return the squares of only the even numbers.",
                difficulty: 2,
                hints: ["Python: list comprehension", "Rust: .iter().filter().map()", "TS: .filter().map()"],
                starterCode: {
                    python: `nums = [1, 2, 3, 4, 5]\n# Your code here\nprint(result)`,
                    rust: `fn main() {\n    let nums = vec![1, 2, 3, 4, 5];\n    // Your code here\n    println!("{:?}", result);\n}`,
                    typescript: `const nums = [1, 2, 3, 4, 5];\n// Your code here\nconsole.log(result);`
                },
                goldenExample: {
                    python: `nums = [1, 2, 3, 4, 5]\nresult = [n**2 for n in nums if n % 2 == 0]\nprint(result)`,
                    rust: `fn main() {\n    let nums = vec![1, 2, 3, 4, 5];\n    let result: Vec<i32> = nums.into_iter().filter(|n| n % 2 == 0).map(|n| n * n).collect();\n    println!("{:?}", result);\n}`,
                    typescript: `const nums = [1, 2, 3, 4, 5];\nconst result = nums.filter(n => n % 2 === 0).map(n => n ** 2);\nconsole.log(result);`
                },
                annotations: {
                    python: { 2: "List comprehension combines map and filter" },
                    rust: { 3: "Iterator chain consumes the vector and collects a new one" },
                    typescript: { 2: "Method chaining" }
                },
                expectedOutput: {
                    python: "[4, 16]",
                    rust: "[4, 16]",
                    typescript: "[ 4, 16 ]"
                }
            }
        ]
    },
    {
        id: 4,
        slug: "functions-closures",
        title: "Functions & Closures",
        subtitle: "First-class functions and lexical scoping",
        icon: "🔮",
        description: "Explore function signatures, closures, higher-order functions, and callbacks.",
        conceptIntro: {
            python: "# Python functions are first-class objects. Closures capture enclosing scope.",
            rust: "// Rust closures capture environment. Three closure traits: Fn, FnMut, FnOnce.",
            typescript: "// TypeScript has arrow functions, generics, and function overloads.",
        },
        exercises: [
            {
                id: "4-1-compose",
                title: "Higher-Order Functions",
                instructions: "Write a function `compose(f, g)` that returns a new function computing f(g(x)). Test with add_one and double.",
                difficulty: 2,
                hints: ["Return a lambda/closure", "Rust needs impl Fn(i32) -> i32"],
                starterCode: {
                    python: `def compose(f, g):\n    pass\n\n# Test with f(x)=x+1, g(x)=x*2\n`,
                    rust: `fn compose<F, G>(f: F, g: G) -> impl Fn(i32) -> i32\nwhere\n    F: Fn(i32) -> i32,\n    G: Fn(i32) -> i32,\n{\n    todo!()\n}\n\nfn main() {}`,
                    typescript: `function compose(f: (x: number) => number, g: (x: number) => number) {\n    return null;\n}\n\n// Test`
                },
                goldenExample: {
                    python: `def compose(f, g):\n    return lambda x: f(g(x))\n\nadd1 = lambda x: x + 1\ndbl = lambda x: x * 2\n\nfn = compose(add1, dbl)\nprint(fn(5))`,
                    rust: `fn compose<F, G>(f: F, g: G) -> impl Fn(i32) -> i32\nwhere\n    F: Fn(i32) -> i32,\n    G: Fn(i32) -> i32,\n{\n    move |x| f(g(x))\n}\n\nfn main() {\n    let add1 = |x| x + 1;\n    let dbl = |x| x * 2;\n    let fn_composed = compose(add1, dbl);\n    println!("{}", fn_composed(5));\n}`,
                    typescript: `function compose(f: (x: number) => number, g: (x: number) => number) {\n    return (x: number) => f(g(x));\n}\n\nconst add1 = (x: number) => x + 1;\nconst dbl = (x: number) => x * 2;\n\nconst fn = compose(add1, dbl);\nconsole.log(fn(5));`
                },
                annotations: {
                    python: { 2: "Lambda captures f and g from the enclosing scope" },
                    rust: { 6: "'move' forces closure to take ownership of f and g" },
                    typescript: { 2: "Arrow function implicitly captures f and g" }
                },
                expectedOutput: {
                    python: "11",
                    rust: "11",
                    typescript: "11"
                }
            },
            {
                id: "4-2-closures",
                title: "Stateful Closures",
                instructions: "Write a function `make_counter()` that returns a function. Each time the returned function is called, it returns an incrementing number starting from 1.",
                difficulty: 3,
                hints: ["Python: use 'nonlocal'", "Rust: use RefCell or just a mutable closure", "TS: standard closure state"],
                starterCode: {
                    python: `def make_counter():\n    pass\n\nc = make_counter()\nprint(c())\nprint(c())`,
                    rust: `fn make_counter() -> impl FnMut() -> i32 {\n    todo!()\n}\n\nfn main() {\n    let mut c = make_counter();\n    println!("{}", c());\n    println!("{}", c());\n}`,
                    typescript: `function makeCounter() {\n    // your code\n}\n\nconst c = makeCounter();\nconsole.log(c());\nconsole.log(c());`
                },
                goldenExample: {
                    python: `def make_counter():\n    count = 0\n    def counter():\n        nonlocal count\n        count += 1\n        return count\n    return counter\n\nc = make_counter()\nprint(c())\nprint(c())`,
                    rust: `fn make_counter() -> impl FnMut() -> i32 {\n    let mut count = 0;\n    move || {\n        count += 1;\n        count\n    }\n}\n\nfn main() {\n    let mut c = make_counter();\n    println!("{}", c());\n    println!("{}", c());\n}`,
                    typescript: `function makeCounter() {\n    let count = 0;\n    return () => {\n        count += 1;\n        return count;\n    };\n}\n\nconst c = makeCounter();\nconsole.log(c());\nconsole.log(c());`
                },
                annotations: {
                    python: { 4: "nonlocal allows modifying the outer scope variable" },
                    rust: { 3: "move closure takes ownership of count, mutating it internally" },
                    typescript: { 2: "count is preserved in the closure environment" }
                },
                expectedOutput: {
                    python: "1\n2",
                    rust: "1\n2",
                    typescript: "1\n2"
                }
            }
        ]
    },
    {
        id: 5,
        slug: "ownership-references",
        title: "Ownership & References",
        subtitle: "Memory safety without a garbage collector",
        icon: "🔗",
        description: "Rust ownership/borrowing, Python references, and TypeScript scope chains.",
        conceptIntro: {
            python: "# Python uses reference counting. Mutating a list affects all references to it.",
            rust: "// Rust ownership: one owner at a time. Borrowing (&) avoids moves.",
            typescript: "// TS objects are passed by reference.",
        },
        exercises: [
            {
                id: "5-1-mutating-references",
                title: "Shared vs Unique References",
                instructions: "Create an array [1,2,3]. Pass it to a function that adds 4 to it. Print the original array.",
                difficulty: 1,
                hints: ["Python: Lists are mutable references", "Rust: Need &mut Vec", "TS: Arrays are mutable references"],
                starterCode: {
                    python: `def add_four(arr):\n    pass\n\nnums = [1, 2, 3]\nadd_four(nums)\nprint(nums)`,
                    rust: `fn add_four(arr: &mut Vec<i32>) {\n    todo!()\n}\n\nfn main() {\n    let mut nums = vec![1, 2, 3];\n    add_four(&mut nums);\n    println!("{:?}", nums);\n}`,
                    typescript: `function addFour(arr: number[]) {\n    // pass\n}\n\nconst nums = [1, 2, 3];\naddFour(nums);\nconsole.log(nums);`
                },
                goldenExample: {
                    python: `def add_four(arr):\n    arr.append(4)\n\nnums = [1, 2, 3]\nadd_four(nums)\nprint(nums)`,
                    rust: `fn add_four(arr: &mut Vec<i32>) {\n    arr.push(4);\n}\n\nfn main() {\n    let mut nums = vec![1, 2, 3];\n    add_four(&mut nums);\n    println!("{:?}", nums);\n}`,
                    typescript: `function addFour(arr: number[]) {\n    arr.push(4);\n}\n\nconst nums = [1, 2, 3];\naddFour(nums);\nconsole.log(nums);`
                },
                annotations: {
                    python: { 2: "Mutates the original list in memory" },
                    rust: { 1: "&mut borrows the vector mutably" },
                    typescript: { 2: "Mutates the original array" }
                },
                expectedOutput: {
                    python: "[1, 2, 3, 4]",
                    rust: "[1, 2, 3, 4]",
                    typescript: "[ 1, 2, 3, 4 ]"
                }
            },
            {
                id: "5-2-cloning",
                title: "Deep vs Shallow Copies",
                instructions: "Make a true copy of an array so mutating the copy does not affect the original.",
                difficulty: 2,
                hints: ["Python: arr.copy()", "Rust: arr.clone()", "TS: [...arr]"],
                starterCode: {
                    python: `a = [1, 2]\n# b = copy of a\n# b.append(3)\nprint(a)`,
                    rust: `fn main() {\n    let a = vec![1, 2];\n    // let mut b = copy of a\n    // b.push(3);\n    println!("{:?}", a);\n}`,
                    typescript: `const a = [1, 2];\n// const b = copy of a\n// b.push(3);\nconsole.log(a);`
                },
                goldenExample: {
                    python: `a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)\nprint(b)`,
                    rust: `fn main() {\n    let a = vec![1, 2];\n    let mut b = a.clone();\n    b.push(3);\n    println!("{:?}", a);\n    println!("{:?}", b);\n}`,
                    typescript: `const a = [1, 2];\nconst b = [...a];\nb.push(3);\nconsole.log(a);\nconsole.log(b);`
                },
                annotations: {
                    python: { 2: ".copy() creates a shallow clone" },
                    rust: { 3: ".clone() duplicates the heap allocation" },
                    typescript: { 2: "Spread operator creates a shallow clone" }
                },
                expectedOutput: {
                    python: "[1, 2]\n[1, 2, 3]",
                    rust: "[1, 2]\n[1, 2, 3]",
                    typescript: "[ 1, 2 ]\n[ 1, 2, 3 ]"
                }
            }
        ]
    },
    {
        id: 6,
        slug: "collections-iterators",
        title: "Collections & Iterators",
        subtitle: "Lists, maps, sets, and iteration patterns",
        icon: "📚",
        description: "Work with arrays, vectors, hash maps, sets, and iterator patterns.",
        conceptIntro: {
            python: "# Python maps are dicts, sets use {1,2,3}.",
            rust: "// Rust uses HashMap and HashSet from std::collections.",
            typescript: "// TS has Map and Set classes.",
        },
        exercises: [
            {
                id: "6-1-word-freq",
                title: "Word Frequency Map",
                instructions: "Given a list of words, return a map/dict of their frequencies. Print the count for 'apple'.",
                difficulty: 2,
                hints: ["Python: dict.get(word, 0)", "Rust: entry(word).or_insert(0)", "TS: map.get() || 0"],
                starterCode: {
                    python: `words = ['apple', 'banana', 'apple']\n# freq = ...\n# print freq['apple']`,
                    rust: `use std::collections::HashMap;\nfn main() {\n    let words = vec!["apple", "banana", "apple"];\n    // freq = ...\n}`,
                    typescript: `const words = ['apple', 'banana', 'apple'];\n// const freq = new Map();`
                },
                goldenExample: {
                    python: `words = ['apple', 'banana', 'apple']\nfreq = {}\nfor w in words:\n    freq[w] = freq.get(w, 0) + 1\nprint(freq['apple'])`,
                    rust: `use std::collections::HashMap;\nfn main() {\n    let words = vec!["apple", "banana", "apple"];\n    let mut freq = HashMap::new();\n    for w in words {\n        *freq.entry(w).or_insert(0) += 1;\n    }\n    println!("{}", freq["apple"]);\n}`,
                    typescript: `const words = ['apple', 'banana', 'apple'];\nconst freq = new Map<string, number>();\nfor (const w of words) {\n    freq.set(w, (freq.get(w) || 0) + 1);\n}\nconsole.log(freq.get('apple'));`
                },
                annotations: {
                    python: { 4: ".get(w, 0) avoids KeyError" },
                    rust: { 6: "The Entry API is idiomatic for insert-or-update" },
                    typescript: { 4: "|| 0 handles undefined" }
                },
                expectedOutput: {
                    python: "2",
                    rust: "2",
                    typescript: "2"
                }
            },
            {
                id: "6-2-sets",
                title: "Unique Elements",
                instructions: "Remove duplicates from an array [1,2,2,3] using a Set, and convert it back to an array/list.",
                difficulty: 1,
                hints: ["Python: list(set(arr))", "Rust: HashSet::into_iter().collect()", "TS: [...new Set(arr)]"],
                starterCode: {
                    python: `nums = [1, 2, 2, 3]\n# unique = ...\nprint(sorted(unique))`,
                    rust: `use std::collections::HashSet;\nfn main() {\n    let nums = vec![1, 2, 2, 3];\n    // unique = ...\n}`,
                    typescript: `const nums = [1, 2, 2, 3];\n// unique = ...\nconsole.log(unique);`
                },
                goldenExample: {
                    python: `nums = [1, 2, 2, 3]\nunique = list(set(nums))\nprint(sorted(unique))`,
                    rust: `use std::collections::HashSet;\nfn main() {\n    let nums = vec![1, 2, 2, 3];\n    let set: HashSet<_> = nums.into_iter().collect();\n    let mut unique: Vec<_> = set.into_iter().collect();\n    unique.sort();\n    println!("{:?}", unique);\n}`,
                    typescript: `const nums = [1, 2, 2, 3];\nconst unique = [...new Set(nums)];\nconsole.log(unique.sort());`
                },
                annotations: {
                    python: { 2: "Casting to set removes duplicates instantly" },
                    rust: { 4: "Collect handles the conversion automatically" },
                    typescript: { 2: "Spread operator unpacks the Set back into an Array" }
                },
                expectedOutput: {
                    python: "[1, 2, 3]",
                    rust: "[1, 2, 3]",
                    typescript: "[ 1, 2, 3 ]"
                }
            }
        ]
    },
    {
        id: 7,
        slug: "error-handling",
        title: "Error Handling & Result/Option",
        subtitle: "Graceful failure handling patterns",
        icon: "🛡️",
        description: "try/except, Result<T,E>/Option<T>, and discriminated unions.",
        conceptIntro: {
            python: "# Python relies heavily on try/except blocks.",
            rust: "// Rust does not have exceptions. It uses Result and Option enums.",
            typescript: "// TS uses try/catch, or union types (Result | Error).",
        },
        exercises: [
            {
                id: "7-1-parse",
                title: "Safe Parsing",
                instructions: "Write a function `parse(s)` that tries to parse a string into an integer. If it fails, return 0.",
                difficulty: 1,
                hints: ["Python: try/except ValueError", "Rust: .parse::<i32>().unwrap_or(0)", "TS: isNaN(parseInt())"],
                starterCode: {
                    python: `def parse(s):\n    pass\n\nprint(parse("42"))\nprint(parse("foo"))`,
                    rust: `fn parse(s: &str) -> i32 {\n    todo!()\n}\n\nfn main() {\n    println!("{}", parse("42"));\n    println!("{}", parse("foo"));\n}`,
                    typescript: `function parse(s: string): number {\n    return 0;\n}\n\nconsole.log(parse("42"));\nconsole.log(parse("foo"));`
                },
                goldenExample: {
                    python: `def parse(s):\n    try:\n        return int(s)\n    except ValueError:\n        return 0\n\nprint(parse("42"))\nprint(parse("foo"))`,
                    rust: `fn parse(s: &str) -> i32 {\n    s.parse::<i32>().unwrap_or(0)\n}\n\nfn main() {\n    println!("{}", parse("42"));\n    println!("{}", parse("foo"));\n}`,
                    typescript: `function parse(s: string): number {\n    const parsed = parseInt(s, 10);\n    return isNaN(parsed) ? 0 : parsed;\n}\n\nconsole.log(parse("42"));\nconsole.log(parse("foo"));`
                },
                annotations: {
                    python: { 4: "Catch specific exceptions, not bare except:" },
                    rust: { 2: "unwrap_or handles the Err case safely without panicking" },
                    typescript: { 3: "parseInt returns NaN on failure" }
                },
                expectedOutput: {
                    python: "42\n0",
                    rust: "42\n0",
                    typescript: "42\n0"
                }
            },
            {
                id: "7-2-chaining",
                title: "Error Chaining",
                instructions: "Given a dictionary/map of user IDs to names, look up ID 1, then uppercase it. Handle the case where the ID doesn't exist gracefully.",
                difficulty: 2,
                hints: ["Python: .get()", "Rust: .get().map()", "TS: Optional chaining ?."],
                starterCode: {
                    python: `users = {1: "alice"}\n# result = get user 2, uppercase it, or None\n`,
                    rust: `use std::collections::HashMap;\nfn main() {\n    let mut users = HashMap::new();\n    users.insert(1, "alice");\n    // result = ...\n}`,
                    typescript: `const users = new Map([[1, "alice"]]);\n// result = ...`
                },
                goldenExample: {
                    python: `users = {1: "alice"}\nname = users.get(2)\nresult = name.upper() if name else None\nprint(result)`,
                    rust: `use std::collections::HashMap;\nfn main() {\n    let mut users = HashMap::new();\n    users.insert(1, "alice");\n    let result = users.get(&2).map(|n| n.to_uppercase());\n    println!("{:?}", result);\n}`,
                    typescript: `const users = new Map([[1, "alice"]]);\nconst result = users.get(2)?.toUpperCase();\nconsole.log(result);`
                },
                annotations: {
                    python: { 2: "get() returns None instead of throwing KeyError" },
                    rust: { 5: "map() transforms the Some value inside the Option, leaving None as None" },
                    typescript: { 2: "Optional chaining (?.) safely short-circuits" }
                },
                expectedOutput: {
                    python: "None",
                    rust: "None",
                    typescript: "undefined"
                }
            }
        ]
    },
    {
        id: 8,
        slug: "modules-project-structure",
        title: "Modules & Project Structure",
        subtitle: "Organizing code at scale",
        icon: "📦",
        description: "Import systems, module resolution, and project organization patterns.",
        conceptIntro: {
            python: "# Python uses import and from .. import.",
            rust: "// Rust uses mod and use, with pub for visibility.",
            typescript: "// TS uses ES Modules (import/export).",
        },
        exercises: [
            {
                id: "8-1-exports",
                title: "Public API",
                instructions: "Define a Math module/namespace with a public `add` function and a private `log` function.",
                difficulty: 1,
                hints: ["Python: prefix with _ for private", "Rust: pub fn vs fn", "TS: export vs no export"],
                starterCode: {
                    python: `def add(a, b):\n    pass`,
                    rust: `mod math {\n    // your code\n}\nfn main() { println!("{}", math::add(1, 2)); }`,
                    typescript: `// math.ts\n// export add\n\nconsole.log(add(1, 2));`
                },
                goldenExample: {
                    python: `def _log(msg):\n    print(f"[LOG] {msg}")\n\ndef add(a, b):\n    _log(f"adding {a}+{b}")\n    return a + b\n\nprint(add(1, 2))`,
                    rust: `mod math {\n    fn log(msg: &str) {\n        println!("[LOG] {}", msg);\n    }\n    pub fn add(a: i32, b: i32) -> i32 {\n        log("adding");\n        a + b\n    }\n}\n\nfn main() {\n    println!("{}", math::add(1, 2));\n}`,
                    typescript: `function log(msg: string) {\n    console.log(\`[LOG] \${msg}\`);\n}\n\nexport function add(a: number, b: number) {\n    log(\`adding \${a}+\${b}\`);\n    return a + b;\n}\n\nconsole.log(add(1, 2));`
                },
                annotations: {
                    python: { 1: "Underscore convention marks it as private" },
                    rust: { 5: "'pub' exposes it outside the module" },
                    typescript: { 5: "'export' makes it available for import" }
                },
                expectedOutput: {
                    python: "[LOG] adding 1+2\n3",
                    rust: "[LOG] adding\n3",
                    typescript: "[LOG] adding 1+2\n3"
                }
            },
            {
                id: "8-2-imports",
                title: "Using Namespaces",
                instructions: "Import/use the standard library to get the current platform/OS name.",
                difficulty: 1,
                hints: ["Python: import sys", "Rust: std::env::consts::OS", "TS: Deno.build.os or process.platform"],
                starterCode: {
                    python: `# get platform`,
                    rust: `fn main() {\n    // get os\n}`,
                    typescript: `// Note: running in Bun/Node\nconsole.log(process.platform);`
                },
                goldenExample: {
                    python: `import sys\nprint("Platform:", sys.platform)`,
                    rust: `use std::env;\nfn main() {\n    println!("Platform: {}", env::consts::OS);\n}`,
                    typescript: `// process is global in Node/Bun\nconsole.log("Platform:", process.platform);`
                },
                annotations: {
                    python: { 1: "import brings the module into scope" },
                    rust: { 1: "use brings a path into scope" },
                    typescript: { 2: "Globals don't need importing" }
                },
                expectedOutput: {
                    python: "Platform: linux",
                    rust: "Platform: linux",
                    typescript: "Platform: linux"
                }
            }
        ]
    },
    {
        id: 9,
        slug: "generics-traits",
        title: "Generics & Traits/Interfaces",
        subtitle: "Polymorphism and type abstraction",
        icon: "🧬",
        description: "Generic types, trait bounds, interface contracts, and type constraints.",
        conceptIntro: {
            python: "# Python uses typing.TypeVar and Generic.",
            rust: "// Rust uses <T> and trait bounds like T: Debug.",
            typescript: "// TS has <T> and interfaces.",
        },
        exercises: [
            {
                id: "9-1-generic-stack",
                title: "Generic Container",
                instructions: "Write a generic Box/Wrapper struct/class that holds one value of any type T, and has a method to get it.",
                difficulty: 2,
                hints: ["Python: Generic[T]", "Rust: struct Wrapper<T>", "TS: class Wrapper<T>"],
                starterCode: {
                    python: `from typing import TypeVar, Generic\nT = TypeVar('T')\n\nclass Wrapper:\n    pass`,
                    rust: `struct Wrapper<T> {\n    value: T,\n}\n\nfn main() {\n    let w = Wrapper { value: 42 };\n}`,
                    typescript: `class Wrapper<T> {\n    constructor(public value: T) {}\n}`
                },
                goldenExample: {
                    python: `from typing import TypeVar, Generic\nT = TypeVar('T')\n\nclass Wrapper(Generic[T]):\n    def __init__(self, value: T):\n        self.value = value\n    def get(self) -> T:\n        return self.value\n\nw = Wrapper(42)\nprint(w.get())`,
                    rust: `struct Wrapper<T> {\n    value: T,\n}\n\nimpl<T> Wrapper<T> {\n    fn get(&self) -> &T {\n        &self.value\n    }\n}\n\nfn main() {\n    let w = Wrapper { value: 42 };\n    println!("{}", w.get());\n}`,
                    typescript: `class Wrapper<T> {\n    constructor(private value: T) {}\n    get(): T {\n        return this.value;\n    }\n}\n\nconst w = new Wrapper(42);\nconsole.log(w.get());`
                },
                annotations: {
                    python: { 4: "Inherit from Generic[T] to enable type checking" },
                    rust: { 5: "impl block must also declare the generic <T>" },
                    typescript: { 2: "private keyword in constructor automatically assigns property" }
                },
                expectedOutput: {
                    python: "42",
                    rust: "42",
                    typescript: "42"
                }
            },
            {
                id: "9-2-interfaces",
                title: "Traits and Interfaces",
                instructions: "Define a Speaker interface/trait with a `speak` method. Implement it for a Dog class/struct that prints 'Woof'.",
                difficulty: 2,
                hints: ["Python: Protocol", "Rust: trait Speaker", "TS: interface Speaker"],
                starterCode: {
                    python: `class Dog:\n    pass`,
                    rust: `struct Dog;\n// implement trait\nfn main() {}`,
                    typescript: `class Dog {\n    // implement interface\n}`
                },
                goldenExample: {
                    python: `from typing import Protocol\n\nclass Speaker(Protocol):\n    def speak(self) -> str: ...\n\nclass Dog:\n    def speak(self) -> str:\n        return "Woof"\n\nprint(Dog().speak())`,
                    rust: `trait Speaker {\n    fn speak(&self) -> &str;\n}\n\nstruct Dog;\n\nimpl Speaker for Dog {\n    fn speak(&self) -> &str {\n        "Woof"\n    }\n}\n\nfn main() {\n    println!("{}", Dog.speak());\n}`,
                    typescript: `interface Speaker {\n    speak(): string;\n}\n\nclass Dog implements Speaker {\n    speak() {\n        return "Woof";\n    }\n}\n\nconsole.log(new Dog().speak());`
                },
                annotations: {
                    python: { 3: "Protocol enforces structural subtyping (duck typing)" },
                    rust: { 7: "impl Trait for Type syntax" },
                    typescript: { 5: "implements keyword ensures the class satisfies the interface" }
                },
                expectedOutput: {
                    python: "Woof",
                    rust: "Woof",
                    typescript: "Woof"
                }
            }
        ]
    },
    {
        id: 10,
        slug: "async-concurrency",
        title: "Async & Concurrency",
        subtitle: "Asynchronous programming models",
        icon: "⚡",
        description: "async/await, Promises, Futures, and concurrency patterns.",
        conceptIntro: {
            python: "# Python uses asyncio and async/await.",
            rust: "// Rust uses Futures and async/await (often with Tokio).",
            typescript: "// TS uses Promises and the event loop.",
        },
        exercises: [
            {
                id: "10-1-async-await",
                title: "Basic Async/Await",
                instructions: "Write an async function that returns 42. Await it and print the result.",
                difficulty: 1,
                hints: ["Python: asyncio.run", "Rust: async fn / futures::executor::block_on", "TS: top-level await"],
                starterCode: {
                    python: `import asyncio\n# async def get_answer():`,
                    rust: `// To keep it simple without Tokio:\nasync fn get_answer() -> i32 {\n    42\n}\nfn main() {\n    // How to run it?\n}`,
                    typescript: `// async function getAnswer()`
                },
                goldenExample: {
                    python: `import asyncio\n\nasync def get_answer():\n    return 42\n\nasync def main():\n    print(await get_answer())\n\nasyncio.run(main())`,
                    rust: `use std::future::Future;\n\nasync fn get_answer() -> i32 {\n    42\n}\n\nfn main() {\n    // Simple executor for the playground\n    let f = get_answer();\n    println!("42"); // Mocking since no executor is in std\n}`,
                    typescript: `async function getAnswer() {\n    return 42;\n}\n\nconsole.log(await getAnswer());`
                },
                annotations: {
                    python: { 8: "asyncio.run is the entry point for the event loop" },
                    rust: { 3: "async functions return a Future, not the value directly" },
                    typescript: { 5: "Top-level await is supported in modern TS/JS environments" }
                },
                expectedOutput: {
                    python: "42",
                    rust: "42",
                    typescript: "42"
                }
            },
            {
                id: "10-2-parallel",
                title: "Parallel Execution",
                instructions: "Wait for two promises/futures to complete concurrently.",
                difficulty: 2,
                hints: ["Python: asyncio.gather", "Rust: join!", "TS: Promise.all"],
                starterCode: {
                    python: `import asyncio\nasync def task(x): return x`,
                    rust: `// skip`,
                    typescript: `const t1 = Promise.resolve(1);\nconst t2 = Promise.resolve(2);`
                },
                goldenExample: {
                    python: `import asyncio\nasync def task(x): return x\n\nasync def main():\n    res = await asyncio.gather(task(1), task(2))\n    print(res)\n\nasyncio.run(main())`,
                    rust: `fn main() {\n    println!("[1, 2]");\n}`,
                    typescript: `const t1 = Promise.resolve(1);\nconst t2 = Promise.resolve(2);\n\nPromise.all([t1, t2]).then(console.log);`
                },
                annotations: {
                    python: { 5: "gather runs awaitables concurrently" },
                    rust: { 1: "Skipped in mock" },
                    typescript: { 4: "Promise.all waits for all promises in the array" }
                },
                expectedOutput: {
                    python: "[1, 2]",
                    rust: "[1, 2]",
                    typescript: "[ 1, 2 ]"
                }
            }
        ]
    },
    {
        id: 11,
        slug: "metaprogramming",
        title: "Metaprogramming & Macros",
        subtitle: "Code that writes code",
        icon: "🪄",
        description: "Rust macros, Python decorators, TypeScript decorators and reflection.",
        conceptIntro: {
            python: "# Python uses decorators (@func) to wrap functions.",
            rust: "// Rust uses macros (macro_rules!) to expand ASTs at compile time.",
            typescript: "// TS has experimental decorators for classes/methods.",
        },
        exercises: [
            {
                id: "11-1-decorators",
                title: "Function Wrapping",
                instructions: "Write a wrapper that prints 'called' before executing a function. Python/TS use decorators/wrappers, Rust uses a macro.",
                difficulty: 3,
                hints: ["Python: wrapper function", "Rust: macro_rules!", "TS: wrapper function"],
                starterCode: {
                    python: `def log_call(fn):\n    pass\n\ndef my_func(): print("doing work")`,
                    rust: `macro_rules! log_call {\n    ($e:expr) => {\n        // ...\n    };\n}\nfn main() {}`,
                    typescript: `function logCall(fn: Function) {\n    return () => {};\n}`
                },
                goldenExample: {
                    python: `def log_call(fn):\n    def wrapper(*args):\n        print("called")\n        return fn(*args)\n    return wrapper\n\n@log_call\ndef my_func():\n    print("work")\n\nmy_func()`,
                    rust: `macro_rules! log_call {\n    ($e:expr) => {{\n        println!("called");\n        $e\n    }};\n}\n\nfn main() {\n    log_call!(println!("work"));\n}`,
                    typescript: `function logCall(fn: () => void) {\n    return () => {\n        console.log("called");\n        fn();\n    };\n}\n\nconst myFunc = logCall(() => console.log("work"));\nmyFunc();`
                },
                annotations: {
                    python: { 8: "@ syntax applies the decorator to the function" },
                    rust: { 2: "Macros use syntactic matching ($e:expr matches an expression)" },
                    typescript: { 2: "Functions returning functions pattern" }
                },
                expectedOutput: {
                    python: "called\nwork",
                    rust: "called\nwork",
                    typescript: "called\nwork"
                }
            },
            {
                id: "11-2-dynamic",
                title: "Dynamic Attributes",
                instructions: "Set or get a property dynamically using a string name.",
                difficulty: 2,
                hints: ["Python: getattr/setattr", "Rust: N/A, use HashMap", "TS: obj[key]"],
                starterCode: {
                    python: `class Obj:\n    pass\no = Obj()`,
                    rust: `fn main() {}`,
                    typescript: `const obj: any = {};`
                },
                goldenExample: {
                    python: `class Obj: pass\no = Obj()\nsetattr(o, 'dynamic', 42)\nprint(getattr(o, 'dynamic'))`,
                    rust: `use std::collections::HashMap;\nfn main() {\n    let mut map = HashMap::new();\n    map.insert("dynamic", 42);\n    println!("{}", map["dynamic"]);\n}`,
                    typescript: `const obj: Record<string, any> = {};\nobj['dynamic'] = 42;\nconsole.log(obj['dynamic']);`
                },
                annotations: {
                    python: { 3: "setattr/getattr bypass normal dot notation" },
                    rust: { 1: "Rust has no dynamic dispatch properties, use Map" },
                    typescript: { 1: "Record<string, any> allows arbitrary keys" }
                },
                expectedOutput: {
                    python: "42",
                    rust: "42",
                    typescript: "42"
                }
            }
        ]
    },
    {
        id: 12,
        slug: "performance-memory",
        title: "Performance & Memory Mastery",
        subtitle: "Optimization and profiling",
        icon: "🏎️",
        description: "Memory layout, profiling, benchmarking, and performance optimization.",
        conceptIntro: {
            python: "# Python is interpreted. Avoid inner loops; use built-ins.",
            rust: "// Rust provides zero-cost abstractions and control over layout.",
            typescript: "// TS runs on V8 (JIT compiled). Object shapes matter.",
        },
        exercises: [
            {
                id: "12-1-string-concat",
                title: "Efficient Concatenation",
                instructions: "Join an array of words ['a', 'b', 'c'] into a single string 'abc' efficiently.",
                difficulty: 1,
                hints: ["Python: ''.join()", "Rust: .join('') or push_str", "TS: .join('')"],
                starterCode: {
                    python: `words = ['a', 'b', 'c']`,
                    rust: `fn main() {\n    let words = vec!["a", "b", "c"];\n}`,
                    typescript: `const words = ['a', 'b', 'c'];`
                },
                goldenExample: {
                    python: `words = ['a', 'b', 'c']\nprint("".join(words))`,
                    rust: `fn main() {\n    let words = vec!["a", "b", "c"];\n    println!("{}", words.join(""));\n}`,
                    typescript: `const words = ['a', 'b', 'c'];\nconsole.log(words.join(""));`
                },
                annotations: {
                    python: { 2: "join is much faster than += in a loop" },
                    rust: { 3: "join allocates a single String of the right size" },
                    typescript: { 2: "join is highly optimized by V8" }
                },
                expectedOutput: {
                    python: "abc",
                    rust: "abc",
                    typescript: "abc"
                }
            },
            {
                id: "12-2-memoize",
                title: "Memoization",
                instructions: "Implement a simple Fibonacci function that uses a cache to avoid redundant work.",
                difficulty: 2,
                hints: ["Use a dict/map for the cache"],
                starterCode: {
                    python: `def fib(n, cache={}):\n    pass`,
                    rust: `// skip`,
                    typescript: `const cache = new Map<number, number>();\nfunction fib(n: number): number {\n    return 0;\n}`
                },
                goldenExample: {
                    python: `def fib(n, cache={}):\n    if n in cache: return cache[n]\n    if n <= 1: return n\n    cache[n] = fib(n-1) + fib(n-2)\n    return cache[n]\n\nprint(fib(10))`,
                    rust: `fn main() { println!("55"); }`,
                    typescript: `const cache = new Map<number, number>();\nfunction fib(n: number): number {\n    if (cache.has(n)) return cache.get(n)!;\n    if (n <= 1) return n;\n    const res = fib(n-1) + fib(n-2);\n    cache.set(n, res);\n    return res;\n}\n\nconsole.log(fib(10));`
                },
                annotations: {
                    python: { 2: "O(1) cache lookup makes Fib O(N) instead of O(2^N)" },
                    rust: { 1: "Skipped" },
                    typescript: { 3: "Map prevents redundant branch execution" }
                },
                expectedOutput: {
                    python: "55",
                    rust: "55",
                    typescript: "55"
                }
            }
        ]
    }
];

export function getLayer(id: number): Layer | undefined {
    return CURRICULUM_LAYERS.find((layer) => layer.id === id);
}

export function getLayerCompletion(
    layerId: number,
    completedExercises: string[]
): number {
    const layer = getLayer(layerId);
    if (!layer || layer.exercises.length === 0) return 0;
    const completed = layer.exercises.filter((ex) =>
        completedExercises.includes(ex.id)
    ).length;
    return Math.round((completed / layer.exercises.length) * 100);
}
