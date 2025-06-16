# FROM dockcross/web-wasm:20210901-4a98c0e
FROM docker.io/dockcross/web-wasm:latest

ENV PATH="/emsdk/upstream/bin:$PATH"

RUN apt-get update \
    && apt-get install -y \
    subversion python2 \
    zlib1g-dev \
    unzip sox \
    gfortran \
    libc6-dev-i386

WORKDIR /opt/kaldi
RUN git clone -b vosk --single-branch https://github.com/alphacep/kaldi . && \
    git checkout bc5baf14231660bd50b7d05788865b4ac6c34481
ADD kaldi.patch /tmp
RUN git apply -v /tmp/kaldi.patch

WORKDIR /opt/kaldi/tools
ENV OPENFST_VERSION=1.8.0
RUN EMCC_LINK_FLAGS="-r" emmake make -j $(nproc) CXXFLAGS="-O3 -r -flto" LDFLAGS=-O3 OPENFST_CONFIGURE="--enable-static --disable-shared --enable-far --enable-ngram-fsts --enable-lookahead-fsts --with-pic" openfst
RUN find . -type f -path '*/.libs/*.a' -exec sh -xc 'mv {} $(dirname {})/..' \;

WORKDIR /opt/kaldi/tools/clapack-wasm
RUN git clone https://github.com/davenamin/clapack-wasm-mirror.git .
ADD clapack-wasm.patch /tmp
RUN git apply -v /tmp/clapack-wasm.patch
RUN make 

WORKDIR /opt/kaldi/src
RUN CXXFLAGS="-O3 -flto" LDFLAGS=-O3 emconfigure ./configure --use-cuda=no --static --static-fst=yes --clapack-root=../tools/clapack-wasm/CLAPACK-3.2.1 --fst-root=../tools/openfst-1.8.0/src
RUN EMCC_CFLAGS="-r -flto -s ERROR_ON_UNDEFINED_SYMBOLS=0 -Wl,--allow-undefined" EMCC_LINK_FLAGS="-r" emmake make -j $(nproc)

WORKDIR /tmp/zlib
RUN curl --fail -q -L https://zlib.net/fossils/zlib-1.2.13.tar.gz | \
    tar xz --strip-components=1
RUN emconfigure ./configure --prefix=/opt --static
RUN emmake make -j $(nproc)
RUN emmake make install
RUN rm -rf /tmp/zlib

WORKDIR /tmp/libarchive
RUN curl --fail -q -L http://www.libarchive.org/downloads/libarchive-3.5.1.tar.gz | \
    tar xz --strip-components=1
RUN emconfigure ./configure CPPFLAGS=-I/opt/include LDFLAGS="-L/opt/lib -static" --with-sysroot=/opt --prefix=/opt
RUN emmake make -j $(nproc)
RUN emmake make install
RUN rm -rf /tmp/libarchive

WORKDIR /opt
