MAKEFILE_ROOT := $(realpath $(dir $(firstword $(MAKEFILE_LIST))))
SRC_ROOT := ${MAKEFILE_ROOT}
VOSK_ROOT := ${MAKEFILE_ROOT}/../vosk
DST_ROOT := ${MAKEFILE_ROOT}/..
VOSK_BROWSER_ROOT := ${MAKEFILE_ROOT}/../lib/src
KALDI_ROOT ?= /opt/kaldi
CLAPACKROOT ?= ${KALDI_ROOT}/tools/clapack-wasm

# https://github.com/emscripten-core/emscripten/blob/master/src/settings.js
COMPILE_FLAGS := \
	-r \
	-flto \
	-std=c++17 \
	-Wno-unused-function \
	-I/opt/include \
	-I$(KALDI_ROOT)/src \
	-I$(KALDI_ROOT)/tools/openfst/include \
	-I$(SRC_ROOT)

LINK_FLAGS := \
	--bind \
	-std=c++17 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
	-s MODULARIZE=1 \
	-s EXPORT_NAME=LoadVosk \
	-s ENVIRONMENT=worker \
	-s EXPORTED_RUNTIME_METHODS=['FS','IDBFS'] \
	-s EXPORT_ES6=1 \
	-s USE_ES6_IMPORT_META=0 \
	-s EXPORTED_FUNCTIONS=['_f_init','_malloc','_free'] \
	--post-js $(SRC_ROOT)/vosk.post.js \
	-lidbfs.js

ifdef DEBUG
DESTDIR ?= ${DST_ROOT}/build/debug
COMPILE_FLAGS += -O0 -gsource-map
LINK_FLAGS += -O0 -gsource-map -s DEMANGLE_SUPPORT=1
else
DESTDIR ?= ${DST_ROOT}/build/release
COMPILE_FLAGS += -O3
LINK_FLAGS += -O3
endif

LIBS = \
	${KALDI_ROOT}/src/base/kaldi-base.a \
	${KALDI_ROOT}/src/cudamatrix/kaldi-cudamatrix.a \
	${KALDI_ROOT}/src/decoder/kaldi-decoder.a \
	${KALDI_ROOT}/src/feat/kaldi-feat.a \
	${KALDI_ROOT}/src/fstext/kaldi-fstext.a \
	${KALDI_ROOT}/src/gmm/kaldi-gmm.a \
	${KALDI_ROOT}/src/hmm/kaldi-hmm.a \
	${KALDI_ROOT}/src/ivector/kaldi-ivector.a \
	${KALDI_ROOT}/src/lat/kaldi-lat.a \
	${KALDI_ROOT}/src/lm/kaldi-lm.a \
	${KALDI_ROOT}/src/matrix/kaldi-matrix.a \
	${KALDI_ROOT}/src/nnet3/kaldi-nnet3.a \
	${KALDI_ROOT}/src/online2/kaldi-online2.a \
	${KALDI_ROOT}/src/transform/kaldi-transform.a \
	${KALDI_ROOT}/src/tree/kaldi-tree.a \
	${KALDI_ROOT}/src/util/kaldi-util.a \
	$(CLAPACKROOT)/CLAPACK-3.2.1/lapack.a \
	$(CLAPACKROOT)/CLAPACK-3.2.1/libcblaswr.a \
	$(CLAPACKROOT)/CBLAS/lib/cblas.a \
	$(CLAPACKROOT)/f2c_BLAS-3.8.0/blas.a \
	$(CLAPACKROOT)/libf2c/libf2c.a \
	${KALDI_ROOT}/tools/openfst/lib/libfst.a \
	${KALDI_ROOT}/tools/openfst/lib/libfstngram.a \
	/opt/lib/libarchive.a \
	/opt/lib/libz.a

SRC = \
	$(SRC_ROOT)/bindings.cc \
	$(SRC_ROOT)/utils.cc \
	$(VOSK_ROOT)/src/recognizer.cc \
	$(VOSK_ROOT)/src/model.cc \
	$(VOSK_ROOT)/src/spk_model.cc \
	$(VOSK_ROOT)/src/vosk_api.cc \
	$(VOSK_ROOT)/src/language_model.cc 

all: dist sync-lib

dist: $(DESTDIR)/vosk.js

sync-lib: $(DESTDIR)/vosk.js
	mkdir -p $(VOSK_BROWSER_ROOT)/gen
	rsync -r vosk.d.ts $(VOSK_BROWSER_ROOT)/gen/vosk.d.ts
	rsync -r $(DESTDIR)/vosk.js $(VOSK_BROWSER_ROOT)/gen/vosk.js
	rsync -r $(DESTDIR)/vosk.wasm $(VOSK_BROWSER_ROOT)/../dist/vosk.wasm	

OBJ := $(patsubst $(SRC_ROOT)/%.cc,$(DESTDIR)/%.a,$(filter $(SRC_ROOT)/%.cc,$(SRC))) \
       $(patsubst $(VOSK_ROOT)/src/%.cc,$(DESTDIR)/%.a,$(filter $(VOSK_ROOT)/src/%.cc,$(SRC)))
OBJ := $(foreach src,$(SRC),$(DESTDIR)/$(notdir $(basename $(src))).a)
OBJ := $(sort $(OBJ))

$(DESTDIR)/%.a: $(SRC_ROOT)/%.cc
	mkdir -p $(dir $@)
	$(CXX) -c -o $@ $(COMPILE_FLAGS) $<

$(DESTDIR)/%.a: $(VOSK_ROOT)/src/%.cc
	mkdir -p $(dir $@)
	$(CXX) -c -o $@ $(COMPILE_FLAGS) $<

$(DESTDIR)/vosk.js: $(OBJ)
	mkdir -p $(dir $@)
	cd $(dir $@); \
	$(CXX) -o $(notdir $@) $(OBJ) $(LINK_FLAGS) $(LIBS)

clean:
	rm -rf ./build

.PHONY: all dist
