// Type definitions for google-closure-compiler-js 20180101.0
// Project: https://developers.google.com/closure/compiler/
// Definitions by: Mister 4 Eyes <https://github.com/Mister4Eyes>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "google-closure-compiler-js" {
	//TODO: Do more investigatoin on what the any types are.
	export interface CompileFlags {
		angularPass?:boolean;
		applyInputSourceMaps?:boolean;
		assumeFunctionWrapper?:boolean;
		checksOnly?:boolean;
		compilationLevel?:'WHITESPACE_ONLY'|'SIMPLE'|'ADVANCED';
		dartPass?:boolean;
		defines?:any;
		env?:'BROWSER'|'CUSTOM';
		exportLocalPropertyDefinitions?:boolean;
		generateExports?:boolean;
		languageIn?:string;
		languageOut?:string;
		newTypeInf?:boolean;
		outputWrapper?:any;
		polymerVersion?:any;
		preserveTypeAnnotations?:boolean;
		processCommonJsModules?:boolean;
		renamePrefixNamespace?:any;
		rewritePolyfills?:boolean;
		useTypesForOptimization?:boolean;
		warningLevel?:'QUIET'|'DEFAULT'|'VERBOSE';
		jsCode?:any[];
		externs?:string[];
		createSourceMap?:boolean;
	}

	interface CompileOutput {
		compiledCode:string,
		errors:string[],
		warnings:string[]
	}

	export function compile(flags: CompileFlags): CompileOutput;
	//These require more investigation
	export function gulp(): any;
	export function logger(options: any, output: any, logger: any): any;
	export function webpack(args: any): void;

	export namespace compile {
		const prototype: {
		};
	}

	export namespace gulp {
		const prototype: {
		};
	}

	export namespace logger {
		const prototype: {
		};
	}

	export namespace webpack {
		const prototype: {
		};
	}	
}
