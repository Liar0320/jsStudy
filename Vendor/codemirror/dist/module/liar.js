// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (CodeMirror) {
    "use strict";

    CodeMirror.defineMode("liar", function (config, parserConfig) {
        "use strict";

        var operatorChars = parserConfig.operatorChars || /^[*+\-%<>!=&|~^]/,
            clientSpan = parserConfig.operatorChars || /\bw00\w+00w\b/g;//¸ñÊ½'w00content00w

        function tokenBase(stream, state) {
            var ch = stream.next();

            // call hooks from the mime type
            //if (hooks[ch]) {
            //    var result = hooks[ch](stream, state);
            //    if (result !== false) return result;
            //}

            if (operatorChars.test(ch)) {
                // operators
                stream.eatWhile(operatorChars);
                return "operator";
            } else {
                stream.eatWhile(/^[_\w\d]/);
                var word = stream.current().toLowerCase();

                if (clientSpan.test(word)) return "filterSpan";
                return null;
            }
        }

        // 'string', with char specified in quote escaped by '\'
        function tokenLiteral(quote) {
            return function (stream, state) {
                var escaped = false, ch;
                while ((ch = stream.next()) != null) {
                    if (ch == quote && !escaped) {
                        state.tokenize = tokenBase;
                        break;
                    }
                    escaped = backslashStringEscapes && !escaped && ch == "\\";
                }
                return "string";
            };
        }
        function tokenComment(depth) {
            return function (stream, state) {
                var m = stream.match(/^.*?(\/\*|\*\/)/)
                if (!m) stream.skipToEnd()
                else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1)
                else if (depth > 1) state.tokenize = tokenComment(depth - 1)
                else state.tokenize = tokenBase
                return "comment"
            }
        }

        function pushContext(stream, state, type) {
            state.context = {
                prev: state.context,
                indent: stream.indentation(),
                col: stream.column(),
                type: type
            };
        }

        function popContext(state) {
            state.indent = state.context.indent;
            state.context = state.context.prev;
        }

        return {
            startState: function () {
                return { tokenize: tokenBase, context: null };
            },

            token: function (stream, state) {
                if (stream.sol()) {
                    if (state.context && state.context.align == null)
                        state.context.align = false;
                }
                if (state.tokenize == tokenBase && stream.eatSpace()) return null;

                var style = state.tokenize(stream, state);
                if (style == "comment") return style;

                if (state.context && state.context.align == null)
                    state.context.align = true;

                var tok = stream.current();
                if (tok == "(")
                    pushContext(stream, state, ")");
                else if (tok == "[")
                    pushContext(stream, state, "]");
                else if (state.context && state.context.type == tok)
                    popContext(state);
                return style;
            },

            indent: function (state, textAfter) {
                var cx = state.context;
                if (!cx) return CodeMirror.Pass;
                var closing = textAfter.charAt(0) == cx.type;
                if (cx.align) return cx.col + (closing ? 0 : 1);
                else return cx.indent + (closing ? 0 : config.indentUnit);
            },

            blockCommentStart: "/*",
            blockCommentEnd: "*/",
          //  lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
            closeBrackets: "()[]{}''\"\"``"
        };
    });

    (function () {
        "use strict";

        // `identifier`
        function hookIdentifier(stream) {
            // MySQL/MariaDB identifiers
            // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
            var ch;
            while ((ch = stream.next()) != null) {
                if (ch == "`" && !stream.eat("`")) return "variable-2";
            }
            stream.backUp(stream.current().length - 1);
            return stream.eatWhile(/\w/) ? "variable-2" : null;
        }

        // "identifier"
        function hookIdentifierDoublequote(stream) {
            // Standard SQL /SQLite identifiers
            // ref: http://web.archive.org/web/20160813185132/http://savage.net.au/SQL/sql-99.bnf.html#delimited%20identifier
            // ref: http://sqlite.org/lang_keywords.html
            var ch;
            while ((ch = stream.next()) != null) {
                if (ch == "\"" && !stream.eat("\"")) return "variable-2";
            }
            stream.backUp(stream.current().length - 1);
            return stream.eatWhile(/\w/) ? "variable-2" : null;
        }

        // variable token
        function hookVar(stream) {
            // variables
            // @@prefix.varName @varName
            // varName can be quoted with ` or ' or "
            // ref: http://dev.mysql.com/doc/refman/5.5/en/user-variables.html
            if (stream.eat("@")) {
                stream.match(/^session\./);
                stream.match(/^local\./);
                stream.match(/^global\./);
            }

            if (stream.eat("'")) {
                stream.match(/^.*'/);
                return "variable-2";
            } else if (stream.eat('"')) {
                stream.match(/^.*"/);
                return "variable-2";
            } else if (stream.eat("`")) {
                stream.match(/^.*`/);
                return "variable-2";
            } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
                return "variable-2";
            }
            return null;
        };

        // short client keyword token
        function hookClient(stream) {
            // \N means NULL
            // ref: http://dev.mysql.com/doc/refman/5.5/en/null-values.html
            if (stream.eat("N")) {
                return "atom";
            }
            // \g, etc
            // ref: http://dev.mysql.com/doc/refman/5.5/en/mysql-commands.html
            return stream.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
        }

        // these keywords are used by all SQL dialects (however, a mode can still overwrite it)
        var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";

        // turn a space-separated list into an array
        function set(str) {
            var obj = {}, words = str.split(" ");
            for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
            return obj;
        }

        CodeMirror.defineMIME("text/x-liar", {
            name: "liar",
            client: {},
            keywords: set("add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime"),
            builtin: set("ascii bigint blob boolean counter decimal double float frozen inet int list map static text timestamp timeuuid tuple uuid varchar varint"),
            atoms: set("false true infinity NaN"),
            operatorChars: /^[<>=]/,
            dateSQL: {},
            support: set("commentSlashSlash decimallessFloat"),
            hooks: {}
        });
    }());

})(CodeMirror);