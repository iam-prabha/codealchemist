import type { Chapter, Exercise, Language } from "@/types";

const createExercise = (
    id: string,
    title: string,
    description: string,
    starterCode: Record<Language, string>,
    hints: string[]
): Exercise => ({
    id,
    title,
    instructions: description,
    starterCode,
    goldenExample: {
        python: "",
        rust: "",
        typescript: "",
    },
    annotations: {
        python: {},
        rust: {},
        typescript: {},
    },
    expectedOutput: {
        python: "",
        rust: "",
        typescript: "",
    },
    hints,
    difficulty: 1,
});

const pythonStarter = (code: string): Record<Language, string> => ({
    python: code,
    rust: "",
    typescript: "",
});

const rustStarter = (code: string): Record<Language, string> => ({
    python: "",
    rust: code,
    typescript: "",
});

const tsStarter = (code: string): Record<Language, string> => ({
    python: "",
    rust: "",
    typescript: code,
});

export const sampleChapters: Chapter[] = [
    {
        id: "ch-1",
        number: 1,
        title: "Variables & Mutability",
        description: "Learn how to declare and use variables in Python, Rust, and TypeScript",
        progress: 0,
        exercises: [
            createExercise(
                "ch1-ex1",
                "Declaring Variables",
                "Declare a variable named 'message' and assign it the value 'Hello, Alchemist!'",
                pythonStarter("# Declare your variable here\n"),
                ["In Python, use the assignment operator (=)", "Variable names are case-sensitive", "Strings need quotes around them"]
            ),
            createExercise(
                "ch1-ex2",
                "Immutable vs Mutable",
                "Create a constant variable for a maximum score value",
                pythonStarter("# Create a constant for max score\n"),
                ["In Python, use UPPERCASE for constants by convention", "In Rust, use 'let mut' for mutable and 'let' for immutable", "In TypeScript, use 'const' keyword"]
            ),
            createExercise(
                "ch1-ex3",
                "Type Annotations",
                "Declare a variable with explicit type annotation",
                pythonStarter("# Declare a variable with type hint\n"),
                ["In Python, use: variable: type = value", "In Rust, use: let variable: type = value", "In TypeScript, use: let variable: type = value"]
            ),
        ],
    },
    {
        id: "ch-2",
        number: 2,
        title: "Primitive & Compound Types",
        description: "Explore different data types and how they're used across languages",
        progress: 0,
        exercises: [
            createExercise(
                "ch2-ex1",
                "Working with Numbers",
                "Create integer and float variables and perform basic arithmetic",
                pythonStarter("# Create number variables\nx = 10\ny = 3.14\nresult = x * y\nprint(result)\n"),
                ["Python has int and float types", "Rust uses i32 for integers, f64 for floats", "TypeScript has number type for both"]
            ),
            createExercise(
                "ch2-ex2",
                "Strings and Characters",
                "Create string variables and use string methods",
                pythonStarter("# String operations\ntext = \"alchemist\"\nprint(text.upper())\nprint(len(text))\n"),
                ["Python strings are objects with methods", "Rust strings are more complex (String vs &str)", "TypeScript strings are primitive with methods"]
            ),
            createExercise(
                "ch2-ex3",
                "Booleans and Comparisons",
                "Use boolean values and comparison operators",
                pythonStarter("# Boolean operations\nis_active = True\nis_admin = False\nresult = is_active and not is_admin\nprint(result)\n"),
                ["Python uses True/False", "Rust uses true/false (lowercase)", "TypeScript uses true/false"]
            ),
        ],
    },
    {
        id: "ch-3",
        number: 3,
        title: "Control Flow",
        description: "Master conditional statements and loops",
        progress: 0,
        exercises: [
            createExercise(
                "ch3-ex1",
                "If-Else Statements",
                "Write a simple conditional to check if a number is positive",
                pythonStarter("# Check if number is positive\nnumber = -5\n\nif number > 0:\n    print(\"positive\")\nelif number < 0:\n    print(\"negative\")\nelse:\n    print(\"zero\")\n"),
                ["Python uses indentation for blocks", "Rust uses match or if/else", "TypeScript uses standard if/else syntax"]
            ),
            createExercise(
                "ch3-ex2",
                "For Loops",
                "Use a for loop to iterate from 0 to 4",
                pythonStarter("# For loop from 0 to 4\nfor i in range(5):\n    print(i)\n"),
                ["Python uses range() for iteration", "Rust uses for item in collection", "TypeScript uses for(let i = 0; i < n; i++)"]
            ),
            createExercise(
                "ch3-ex3",
                "While Loops",
                "Create a while loop that counts down from 5",
                pythonStarter("# Countdown from 5\ncount = 5\nwhile count > 0:\n    print(count)\n    count -= 1\nprint(\"blast off!\")\n"),
                ["While loops exist in all three languages", "Be careful of infinite loops!", "Rust requires explicit iteration with loops"]
            ),
        ],
    },
    {
        id: "ch-4",
        number: 4,
        title: "Functions & Closures",
        description: "Learn to define and use functions effectively",
        progress: 0,
        exercises: [
            createExercise(
                "ch4-ex1",
                "Basic Functions",
                "Define a function that adds two numbers",
                pythonStarter("# Define add function\ndef add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)\n"),
                ["Python uses 'def' keyword", "Rust uses 'fn' keyword", "TypeScript uses 'function' or arrow syntax"]
            ),
            createExercise(
                "ch4-ex2",
                "Default Parameters",
                "Create a function with default parameter values",
                pythonStarter("# Function with defaults\ndef greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\nprint(greet(\"Alchemist\"))\nprint(greet(\"Alchemist\", \"Greetings\"))\n"),
                ["Python supports default values", "Rust uses Option<T> instead", "TypeScript supports defaults and optional params"]
            ),
            createExercise(
                "ch4-ex3",
                "Lambda Functions",
                "Use a lambda to square numbers",
                pythonStarter("# Lambda to square\nsquare = lambda x: x ** 2\nnumbers = [1, 2, 3, 4]\nsquared = list(map(square, numbers))\nprint(squared)\n"),
                ["Python lambdas are single-expression functions", "Rust uses closures |x| expression", "TypeScript arrow functions: (x) => x ** 2"]
            ),
        ],
    },
    {
        id: "ch-5",
        number: 5,
        title: "Ownership & References",
        description: "Understand Rust's unique ownership model",
        progress: 0,
        exercises: [
            createExercise(
                "ch5-ex1",
                "Understanding Ownership",
                "Explore how ownership works in Rust",
                rustStarter("// Ownership demo\nlet s1 = String::from(\"hello\");\nlet s2 = s1;\n// println!(\"{}\", s1); // This would error!\nprintln!(\"{}\", s2);\n"),
                ["Rust ownership moves by default", "Clone to duplicate data", "Use references (&) to borrow"]
            ),
            createExercise(
                "ch5-ex2",
                "Borrowing",
                "Use references to avoid ownership transfer",
                rustStarter("// Borrowing demo\nfn calculate_length(s: &String) -> usize {\n    s.len()\n}\n\nlet s = String::from(\"hello\");\nlet len = calculate_length(&s);\nprintln!(\"Length of '{}' is {}\", s, len);\n"),
                ["References are immutable by default", "Use &mut for mutable references", "Only one mutable reference allowed"]
            ),
            createExercise(
                "ch5-ex3",
                "Lifetimes",
                "Understand basic lifetime annotations",
                rustStarter("// Lifetime demo\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n"),
                ["Lifetimes prevent dangling references", "Syntax: 'a (tick a)", "Most cases don't need explicit lifetimes"]
            ),
        ],
    },
    {
        id: "ch-6",
        number: 6,
        title: "Collections & Iterators",
        description: "Work with arrays, vectors, lists, and iteration patterns",
        progress: 0,
        exercises: [
            createExercise(
                "ch6-ex1",
                "Lists and Arrays",
                "Create and access list elements",
                pythonStarter("# List operations\nfruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits[0])\nprint(len(fruits))\nfruits.append(\"date\")\nprint(fruits)\n"),
                ["Python lists are dynamic arrays", "Rust Vec<T> is the equivalent", "TypeScript arrays: let arr: string[] = []"]
            ),
            createExercise(
                "ch6-ex2",
                "Dictionaries/Maps",
                "Use key-value data structures",
                pythonStarter("# Dictionary operations\nperson = {\n    \"name\": \"Alice\",\n    \"age\": 30,\n    \"city\": \"NYC\"\n}\nprint(person[\"name\"])\nperson[\"email\"] = \"alice@example.com\"\nprint(person)\n"),
                ["Python dicts are hash maps", "Rust uses HashMap<K, V>", "TypeScript uses Map or object literals"]
            ),
            createExercise(
                "ch6-ex3",
                "Iteration",
                "Iterate over collections using different methods",
                pythonStarter("# Iterator patterns\nnumbers = [1, 2, 3, 4, 5]\n\n# List comprehension\nsquares = [x**2 for x in numbers]\nprint(squares)\n\n# Filter\nevens = [x for x in numbers if x % 2 == 0]\nprint(evens)\n"),
                ["Python has powerful comprehensions", "Rust uses iterator adaptors", "TypeScript uses map/filter methods"]
            ),
        ],
    },
    {
        id: "ch-7",
        number: 7,
        title: "Error Handling",
        description: "Handle errors gracefully across languages",
        progress: 0,
        exercises: [
            createExercise(
                "ch7-ex1",
                "Try-Catch Blocks",
                "Handle exceptions in Python/TypeScript",
                pythonStarter("# Exception handling\ndef divide(a, b):\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        return \"Cannot divide by zero!\"\n    except TypeError:\n        return \"Invalid types!\"\n\nprint(divide(10, 2))\nprint(divide(10, 0))\n"),
                ["Python uses try/except/finally", "TypeScript uses try/catch", "Rust uses Result<T, E> type"]
            ),
            createExercise(
                "ch7-ex2",
                "Result Types (Rust)",
                "Use Result for error handling in Rust",
                rustStarter("// Result type\nfn divide(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(\"Cannot divide by zero\".to_string())\n    } else {\n        Ok(a / b)\n    }\n}\n\nmatch divide(10.0, 2.0) {\n    Ok(result) => println!(\"Result: {}\", result),\n    Err(e) => println!(\"Error: {}\", e),\n}\n"),
                ["Result<T, E> is Rust's error handling", "Ok() wraps success, Err() wraps failure", "Use ? operator to propagate errors"]
            ),
            createExercise(
                "ch7-ex3",
                "Optional Values",
                "Handle nullable values safely",
                pythonStarter("# Optional handling\nuser = {\"name\": \"Alice\", \"age\": None}\n\nname = user.get(\"name\")\nage = user.get(\"age\")\n\nif age is not None:\n    print(f\"Age: {age}\")\nelse:\n    print(\"Age not provided\")\n"),
                ["Python uses None", "Rust uses Option<T>", "TypeScript uses null/undefined with optional chaining"]
            ),
        ],
    },
    {
        id: "ch-8",
        number: 8,
        title: "Modules & Project Structure",
        description: "Organize code into reusable modules",
        progress: 0,
        exercises: [
            createExercise(
                "ch8-ex1",
                "Import Statements",
                "Import and use modules",
                pythonStarter("# Import modules\nimport math\nfrom collections import Counter\n\nprint(math.pi)\nprint(math.sqrt(16))\n\ntext = \"aabbccdd\"\ncounter = Counter(text)\nprint(counter)\n"),
                ["Python uses import statement", "Rust uses 'use' for items", "TypeScript uses import { } from"]
            ),
            createExercise(
                "ch8-ex2",
                "Creating Modules",
                "Create a simple module with functions",
                pythonStarter("# mymodule.py (simulated)\ndef add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\n# from mymodule import add, multiply\n# result = add(3, multiply(2, 4))\nprint(\"Module created!\")\n"),
                ["Each .py file is a module", "Rust: mod keyword creates modules", "TypeScript: one file = one module"]
            ),
            createExercise(
                "ch8-ex3",
                "Package Management",
                "Understand package.json and dependencies",
                tsStarter('// Understanding imports\nimport { add, multiply } from "./math";\n\nconst result = add(3, multiply(2, 4));\nconsole.log(result);\n\n// Export in math.ts:\n// export function add(a: number, b: number): number { return a + b; }\n// export function multiply(a: number, b: number): number { return a * b; }\n'),
                ["npm/yarn/pnpm for packages", "TypeScript needs tsconfig.json", "Rust uses Cargo.toml"]
            ),
        ],
    },
    {
        id: "ch-9",
        number: 9,
        title: "Generics & Traits",
        description: "Write flexible, reusable code with generics",
        progress: 0,
        exercises: [
            createExercise(
                "ch9-ex1",
                "Generic Functions",
                "Create a function that works with any type",
                pythonStarter("# Generic-like function (type hints)\ndef first_element(lst: list) -> any:\n    return lst[0] if lst else None\n\nnumbers = [1, 2, 3]\nwords = [\"a\", \"b\", \"c\"]\n\nprint(first_element(numbers))\nprint(first_element(words))\n"),
                ["Python uses type hints with Any", "Rust generics: fn<T>", "TypeScript generics: <T>"]
            ),
            createExercise(
                "ch9-ex2",
                "Generic Types",
                "Create a generic container type",
                pythonStarter("# Generic container\nfrom typing import TypeVar, Generic\n\nT = TypeVar(\"T\")\n\nclass Box(Generic[T]):\n    def __init__(self, value: T):\n        self.value = value\n    \n    def get(self) -> T:\n        return self.value\n\nint_box = Box(42)\nstr_box = Box(\"hello\")\nprint(int_box.get())\nprint(str_box.get())\n"),
                ["Python generics via TypeVar", "Rust uses generic types <T>", "TypeScript: class Box<T>"]
            ),
            createExercise(
                "ch9-3",
                "Traits (Rust)",
                "Define and implement traits",
                rustStarter("// Trait definition\ntrait Summary {\n    fn summarize(&self) -> String;\n}\n\nstruct Article {\n    title: String,\n    author: String,\n}\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        format!(\"{} by {}\", self.title, self.author)\n    }\n}\n\nlet article = Article {\n    title: String::from(\"Rust Traits\"),\n    author: String::from(\"Alchemist\"),\n};\nprintln!(\"{}\", article.summarize());\n"),
                ["Traits define shared behavior", "Similar to interfaces in other languages", "Implement trait for types"]
            ),
        ],
    },
    {
        id: "ch-10",
        number: 10,
        title: "Async & Concurrency",
        description: "Handle asynchronous operations and parallelism",
        progress: 0,
        exercises: [
            createExercise(
                "ch10-ex1",
                "Async/Await",
                "Write asynchronous code",
                pythonStarter("# Async/await in Python\nimport asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return \"data received\"\n\nasync def main():\n    result = await fetch_data()\n    print(result)\n\nasyncio.run(main())\n"),
                ["Python uses async/await", "Rust uses async/await with Tokio", "TypeScript has native async/await"]
            ),
            createExercise(
                "ch10-ex2",
                "Promises (TypeScript)",
                "Handle async with promises",
                tsStarter('// Promise handling\nfunction fetchData(): Promise<string> {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve("data"), 1000);\n  });\n}\n\nfetchData().then((data) => console.log(data));\n\n// async/await version\nasync function main() {\n  const data = await fetchData();\n  console.log(data);\n}\nmain();\n'),
                ["Promises represent eventual completion", "async functions return Promises", "await pauses until Promise resolves"]
            ),
            createExercise(
                "ch10-ex3",
                "Parallel Execution",
                "Run tasks concurrently",
                pythonStarter("# Concurrent execution\nimport asyncio\n\nasync def task1():\n    await asyncio.sleep(1)\n    return \"Task 1 done\"\n\nasync def task2():\n    await asyncio.sleep(0.5)\n    return \"Task 2 done\"\n\nasync def main():\n    results = await asyncio.gather(task1(), task2())\n    for r in results:\n        print(r)\n\nasyncio.run(main())\n"),
                ["asyncio.gather runs tasks concurrently", "Rust uses tokio::join!", "TypeScript uses Promise.all"]
            ),
        ],
    },
    {
        id: "ch-11",
        number: 11,
        title: "Metaprogramming",
        description: "Write code that manipulates code",
        progress: 0,
        exercises: [
            createExercise(
                "ch11-ex1",
                "Decorators",
                "Use decorators to modify function behavior",
                pythonStarter("# Decorator example\ndef timer(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f\"{func.__name__} took {end-start:.2f}s\")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    import time\n    time.sleep(0.5)\n    return \"Done!\"\n\nprint(slow_function())\n"),
                ["Decorators wrap functions", "@decorator syntax", "Can modify behavior without changing source"]
            ),
            createExercise(
                "ch11-ex2",
                "Type Introspection",
                "Examine types at runtime",
                pythonStarter("# Type introspection\nfrom typing import get_type_hints\n\ndef process(data: dict) -> str:\n    return str(data)\n\nhints = get_type_hints(process)\nprint(\"Type hints:\", hints)\n\nprint(\"Type of process:\", type(process).__name__)\nprint(\"Module:\", type(process).__module__)\n"),
                ["Python has rich introspection", "dir() lists attributes", "type() returns the type"]
            ),
            createExercise(
                "ch11-ex3",
                "Macros (Rust)",
                "Understand declarative macros",
                rustStarter("// Macro_rules! example\nmacro_rules! create_function {\n    ($func_name:ident) => {\n        fn $func_name() {\n            println!(stringify!($func_name), \"was called\")\n        }\n    };\n}\n\ncreate_function!(my_function);\nmy_function();\n"),
                ["Macros generate code at compile time", "macro_rules! for declarative macros", "Use $ for metavariables"]
            ),
        ],
    },
    {
        id: "ch-12",
        number: 12,
        title: "Performance & Optimization",
        description: "Write efficient, optimized code",
        progress: 0,
        exercises: [
            createExercise(
                "ch12-ex1",
                "Time Complexity",
                "Understand Big O notation",
                pythonStarter("# Time complexity examples\n# O(1) - Constant\ndef get_first(lst):\n    return lst[0]\n\n# O(n) - Linear\ndef find_max(lst):\n    max_val = lst[0]\n    for x in lst:\n        if x > max_val:\n            max_val = x\n    return max_val\n\n# O(n^2) - Quadratic\ndef bubble_sort(lst):\n    n = len(lst)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if lst[j] > lst[j+1]:\n                lst[j], lst[j+1] = lst[j+1], lst[j]\n    return lst\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))\n"),
                ["Big O describes algorithmic complexity", "O(1) < O(log n) < O(n) < O(n log n) < O(n^2)", "Choose the right algorithm for your data"]
            ),
            createExercise(
                "ch12-ex2",
                "Memory Optimization",
                "Optimize memory usage",
                pythonStarter("# Memory-efficient patterns\nimport sys\n\n# Generator vs List\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\n# Generator (lazy evaluation)\nfib_gen = fibonacci(1000)\nprint(\"Generator size:\", sys.getsizeof(fib_gen))\n\n# List (eager evaluation)\nfib_list = list(fibonacci(1000))\nprint(\"List size:\", sys.getsizeof(fib_list))\n"),
                ["Generators are memory-efficient", "yield produces values lazily", "Use itertools for more patterns"]
            ),
            createExercise(
                "ch12-ex3",
                "Profiling",
                "Measure code performance",
                pythonStarter("# Profiling code\nimport cProfile\nimport pstats\n\ndef heavy_function():\n    total = 0\n    for i in range(10000):\n        total += i ** 2\n    return total\n\nprofiler = cProfile.Profile()\nprofiler.enable()\n\nresult = heavy_function()\nprint(\"Result:\", result)\n\nprofiler.disable()\nstats = pstats.Stats(profiler)\nstats.sort_stats('cumulative')\nstats.print_stats(5)\n"),
                ["cProfile finds bottlenecks", "timeit measures small snippets", "line_profiler for line-by-line analysis"]
            ),
        ],
    },
];

export const getChapter = (id: string): Chapter | undefined => {
    return sampleChapters.find((ch) => ch.id === id);
};

export const getChapterByNumber = (num: number): Chapter | undefined => {
    return sampleChapters.find((ch) => ch.number === num);
};
