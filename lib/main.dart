import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_tts/flutter_tts.dart';

// Puerto propio de la app (registro de la familia) para evitar «Address already in use».
const int kServerPort = 9054;

final InAppLocalhostServer _server =
    InAppLocalhostServer(port: kServerPort, documentRoot: 'assets/web');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await _server.start();
  } catch (e) {
    debugPrint('Servidor local no iniciado: $e');
  }
  runApp(const JprdProApp());
}

class JprdProApp extends StatelessWidget {
  const JprdProApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'JPRD PRO',
        debugShowCheckedModeBanner: false,
        theme: ThemeData.dark(useMaterial3: true),
        home: const Shell(),
      );
}

class Shell extends StatefulWidget {
  const Shell({super.key});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  InAppWebViewController? _c;
  final FlutterTts _tts = FlutterTts();
  double _rate = 0.5;

  @override
  void initState() {
    super.initState();
    _initTts();
  }

  Future<void> _initTts() async {
    // Con awaitSpeakCompletion la lectura de una lección completa avanza sola de parte en parte.
    await _tts.awaitSpeakCompletion(true);
    try { await _tts.setLanguage('es-ES'); } catch (_) {}
    try { await _tts.setSpeechRate(_rate); } catch (_) {}
    await _tts.setPitch(1.0);
    _tts.setCompletionHandler(() {
      _c?.evaluateJavascript(source: "window.__ttsDone && window.__ttsDone();");
    });
    _tts.setCancelHandler(() {
      _c?.evaluateJavascript(source: "window.__ttsDone && window.__ttsDone();");
    });
  }

  Future<void> _handleTts(dynamic arg) async {
    if (arg is! Map) return;
    final cmd = arg['cmd'];
    if (cmd == 'stop') {
      await _tts.stop();
      return;
    }
    if (cmd == 'rate') {
      final r = double.tryParse('${arg['rate']}');
      if (r != null) {
        _rate = r.clamp(0.2, 1.0);
        try { await _tts.setSpeechRate(_rate); } catch (_) {}
      }
      return;
    }
    if (cmd == 'speak') {
      final text = (arg['text'] ?? '').toString();
      if (text.trim().isEmpty) return;
      await _tts.stop();
      try { await _tts.setSpeechRate(_rate); } catch (_) {}
      try { await _tts.setLanguage('es-ES'); } catch (_) {
        try { await _tts.setLanguage('es-US'); } catch (_) {}
      }
      await _tts.speak(text);
    }
  }

  @override
  Widget build(BuildContext context) => PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, _) async {
          if (didPop) return;
          await _tts.stop();
          if (_c != null && await _c!.canGoBack()) {
            _c!.goBack();
          } else {
            SystemNavigator.pop();
          }
        },
        child: Scaffold(
          backgroundColor: const Color(0xFF0F172A),
          body: SafeArea(
            child: InAppWebView(
              initialUrlRequest:
                  URLRequest(url: WebUri('http://localhost:$kServerPort/index.html')),
              initialSettings: InAppWebViewSettings(
                javaScriptEnabled: true,
                transparentBackground: true,
                supportZoom: false,
              ),
              onWebViewCreated: (c) {
                _c = c;
                c.addJavaScriptHandler(handlerName: 'tts', callback: (args) {
                  if (args.isNotEmpty) _handleTts(args.first);
                  return null;
                });
              },
            ),
          ),
        ),
      );

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }
}
